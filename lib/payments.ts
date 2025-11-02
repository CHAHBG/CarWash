type PaymentStatus = 'success' | 'pending' | 'failed';

export type PaymentResponse = {
    success: boolean;
    status: PaymentStatus;
    message?: string;
    reference?: string;
    deeplinkUrl?: string;
    raw?: unknown;
};

type MobileMoneyParams = {
    amount: number;
    phoneNumber: string;
    externalId: string;
    customerName?: string;
    callbackUrl?: string;
    metadata?: Record<string, unknown>;
};

const PAYMENT_BACKEND_URL = process.env.EXPO_PUBLIC_PAYMENT_BACKEND_URL || process.env.EXPO_PUBLIC_API_URL || '';

const ORANGE_API_URL = process.env.EXPO_PUBLIC_ORANGE_API_URL || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/orange/initiate` : '');
const ORANGE_STATUS_URL = process.env.EXPO_PUBLIC_ORANGE_API_STATUS_URL || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/orange/status` : '');
const ORANGE_API_KEY = process.env.EXPO_PUBLIC_ORANGE_API_KEY || process.env.EXPO_PUBLIC_ORANGE_MONEY_API_KEY || '';
const ORANGE_API_SECRET = process.env.EXPO_PUBLIC_ORANGE_MONEY_API_SECRET || '';
const ORANGE_MERCHANT_KEY = process.env.EXPO_PUBLIC_ORANGE_MONEY_MERCHANT_KEY || '';

const WAVE_API_URL = process.env.EXPO_PUBLIC_WAVE_API_URL || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/wave/initiate` : '');
const WAVE_STATUS_URL = process.env.EXPO_PUBLIC_WAVE_API_STATUS_URL || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/wave/status` : '');
const WAVE_API_KEY = process.env.EXPO_PUBLIC_WAVE_API_KEY || '';
const WAVE_API_SECRET = process.env.EXPO_PUBLIC_WAVE_API_SECRET || '';

const formatPhoneNumber = (phone: string) => phone.replace(/\s/g, '').trim();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateSuccess = (provider: string): PaymentResponse => ({
    success: true,
    status: 'success',
    message: `${provider} en mode test: configurez les variables d'environnement pour activer le paiement réel.`,
});

const buildHeaders = (provider: 'orange' | 'wave') => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (provider === 'orange') {
        if (ORANGE_API_KEY) headers['x-api-key'] = ORANGE_API_KEY;
        if (ORANGE_API_SECRET) headers['x-api-secret'] = ORANGE_API_SECRET;
        if (ORANGE_MERCHANT_KEY) headers['x-merchant-key'] = ORANGE_MERCHANT_KEY;
    }

    if (provider === 'wave') {
        if (WAVE_API_KEY) headers['x-api-key'] = WAVE_API_KEY;
        if (WAVE_API_SECRET) headers['x-api-secret'] = WAVE_API_SECRET;
    }

    return headers;
};

const normaliseResponse = (provider: string, payload: any): PaymentResponse => {
    const statusFromPayload = typeof payload?.status === 'string' ? payload.status.toLowerCase() : undefined;
    const status: PaymentStatus = statusFromPayload === 'pending' || statusFromPayload === 'failed' ? statusFromPayload : 'success';

    const message = payload?.message
        || (status === 'pending'
            ? `${provider}: transaction en attente de confirmation.`
            : `${provider}: paiement confirmé.`);

    return {
        success: status !== 'failed',
        status,
        message,
        reference: payload?.reference || payload?.transactionId,
        deeplinkUrl: payload?.deeplinkUrl,
        raw: payload,
    };
};

const extractErrorMessage = async (response: Response, provider: string) => {
    try {
        const body = await response.text();
        return `${provider}: ${response.status} - ${body || response.statusText}`;
    } catch {
        return `${provider}: ${response.status} - ${response.statusText}`;
    }
};

const requestPayment = async (
    provider: 'orange' | 'wave',
    url: string,
    body: Record<string, unknown>
): Promise<PaymentResponse> => {
    if (!url) {
        return simulateSuccess(provider === 'orange' ? 'Orange Money' : 'Wave');
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: buildHeaders(provider),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return {
                success: false,
                status: 'failed',
                message: await extractErrorMessage(response, provider === 'orange' ? 'Orange Money' : 'Wave'),
            };
        }

        const payload = await response.json().catch(() => ({}));
        return normaliseResponse(provider === 'orange' ? 'Orange Money' : 'Wave', payload);
    } catch (error: any) {
        return {
            success: false,
            status: 'failed',
            message: error?.message || `Erreur inconnue avec ${provider === 'orange' ? 'Orange Money' : 'Wave'}.`,
        };
    }
};

const waitForStatus = async (
    provider: 'orange' | 'wave',
    statusUrl: string,
    reference?: string,
    attempts = 3
): Promise<PaymentResponse | null> => {
    if (!statusUrl || !reference) {
        return null;
    }

    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetch(`${statusUrl}?reference=${encodeURIComponent(reference)}`, {
                headers: buildHeaders(provider),
            });

            if (!response.ok) {
                await sleep(1000);
                continue;
            }

            const payload = await response.json().catch(() => ({}));
            const result = normaliseResponse(provider === 'orange' ? 'Orange Money' : 'Wave', payload);

            if (result.status !== 'pending') {
                return result;
            }
        } catch {
            await sleep(1000);
        }

        await sleep(1500);
    }

    return null;
};

export const initiateOrangeMoneyPayment = async ({
    amount,
    phoneNumber,
    externalId,
    customerName,
    callbackUrl,
    metadata,
}: MobileMoneyParams): Promise<PaymentResponse> => {
    if (!phoneNumber) {
        return { success: false, status: 'failed', message: 'Numéro de téléphone requis pour Orange Money.' };
    }

    const response = await requestPayment('orange', ORANGE_API_URL, {
        amount,
        phoneNumber: formatPhoneNumber(phoneNumber),
        externalId,
        customerName,
        callbackUrl: callbackUrl || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/orange/callback` : undefined),
        metadata,
    });

    if (response.status === 'pending') {
        const resolved = await waitForStatus('orange', ORANGE_STATUS_URL, response.reference);
        return resolved ?? response;
    }

    return response;
};

export const initiateWavePayment = async ({
    amount,
    phoneNumber,
    externalId,
    callbackUrl,
    metadata,
}: MobileMoneyParams): Promise<PaymentResponse> => {
    if (!phoneNumber) {
        return { success: false, status: 'failed', message: 'Numéro de téléphone requis pour Wave.' };
    }

    const response = await requestPayment('wave', WAVE_API_URL, {
        amount,
        phoneNumber: formatPhoneNumber(phoneNumber),
        externalId,
        callbackUrl: callbackUrl || (PAYMENT_BACKEND_URL ? `${PAYMENT_BACKEND_URL}/payments/wave/callback` : undefined),
        metadata,
    });

    if (response.status === 'pending') {
        const resolved = await waitForStatus('wave', WAVE_STATUS_URL, response.reference);
        return resolved ?? response;
    }

    return response;
};

export const initiateCardPayment = async (): Promise<PaymentResponse> => ({
    success: false,
    status: 'failed',
    message: "Paiement par carte en cours d'intégration. Branchez votre passerelle (Stripe, Paystack, etc.).",
});
