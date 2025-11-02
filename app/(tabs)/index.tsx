import {SafeAreaView} from "react-native-safe-area-context";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, Linking, Animated} from "react-native";
import {Fragment, useMemo, useRef, useState, useEffect} from "react";
import cn from 'clsx';
import { router } from "expo-router";

import CartButton from "@/components/CartButton";
import {images, offers} from "@/constants";
import useAuthStore from "@/store/auth.store";
import LoyaltyBanner from "@/components/LoyaltyBanner";

const RESTAURANT_PHONE = process.env.EXPO_PUBLIC_RESTAURANT_PHONE || "+221 77 123 45 67";
const RESTAURANT_LOCATION = process.env.EXPO_PUBLIC_RESTAURANT_LOCATION || "Thiès, Sénégal";

export default function Index() {
    const { isAuthenticated } = useAuthStore();
    const [showHeroCard, setShowHeroCard] = useState(true);
    const [showLoyaltyBanner, setShowLoyaltyBanner] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, damping: 12, stiffness: 110, useNativeDriver: true })
        ]).start();
    }, [fadeAnim, slideAnim]);

  const handleCall = () => {
    Linking.openURL(`tel:${RESTAURANT_PHONE.replace(/\s/g, '')}`);
  };

  const handleOfferPress = (category: string) => {
    // Navigate to menu tab with the selected category
    router.push({
      pathname: '/menu',
      params: { category }
    });
  };

    const heroFacts = useMemo(
        () => [
            { label: 'Temps moyen livraison', value: '25 min' },
            { label: 'Commandes aujourd\'hui', value: '42' },
            { label: 'Points fidélité actifs', value: '1 280' },
        ],
        []
    );

  return (
      <SafeAreaView className="flex-1 bg-white">
          <FlatList
              data={offers}
              renderItem={({ item, index }) => {
                  const isEven = index % 2 === 0;

                  return (
                      <View>
                          <Pressable
                              className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                              style={{ backgroundColor: item.color }}
                              android_ripple={{ color: "#fffff22"}}
                              onPress={() => handleOfferPress(item.category)}
                          >
                              {({ pressed }) => (
                                  <Fragment>
                                      <View className={"h-full w-1/2"}>
                                        <Image source={item.image} className={"size-full"} resizeMode={"contain"} />
                                      </View>

                                      <View className={cn("offer-card__info", isEven ? 'pl-10': 'pr-10')}>
                                          <Text className="h1-bold text-white leading-tight">
                                              {item.title}
                                          </Text>
                                          <Image
                                            source={images.arrowRight}
                                            className="size-10"
                                            resizeMode="contain"
                                            tintColor="#ffffff"
                                          />
                                      </View>
                                  </Fragment>
                              )}
                          </Pressable>
                      </View>
                  )
              }}
              contentContainerClassName="pb-28 px-5"
              ListHeaderComponent={() => (
                  <Animated.View
                      className="w-full my-5"
                      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                  >
                      <View className="flex-between flex-row w-full mb-4">
                          <View className="flex-start">
                              <Text className="small-bold" style={{color: '#E63946'}}>Livraison à</Text>
                              <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                                  <Text className="paragraph-bold text-dark-100">{RESTAURANT_LOCATION}</Text>
                                  <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                              </TouchableOpacity>
                          </View>

                          <CartButton />
                      </View>

                      {showHeroCard && (
                          <View className="rounded-3xl p-5 mb-4 border border-gray-100" style={{backgroundColor: '#FDF2F4'}}>
                              <View className="flex-row items-start justify-between">
                                  <View className="flex-1 pr-4">
                                      <Text className="text-2xl font-quicksand-bold text-dark-100 mb-1">
                                          Car Wash Restaurant
                                      </Text>
                                      <Text className="text-sm text-gray-600">
                                          Saveurs locales & cocktails rafraîchissants à {RESTAURANT_LOCATION}.
                                      </Text>
                                  </View>
                                  <TouchableOpacity onPress={() => setShowHeroCard(false)}>
                                      <Text className="text-gray-400 text-lg">×</Text>
                                  </TouchableOpacity>
                              </View>

                              <View className="flex-row items-center justify-between mt-5">
                                  <TouchableOpacity 
                                      onPress={handleCall}
                                      className="flex-row items-center gap-2 px-4 py-2 rounded-full"
                                      style={{backgroundColor: '#FFFFFF'}}
                                  >
                                      <Image source={images.phone} className="size-4" resizeMode="contain" tintColor="#E63946" />
                                      <Text className="text-sm font-semibold" style={{color: '#E63946'}}>Appeler</Text>
                                  </TouchableOpacity>
                                  <Text className="text-xs text-gray-500">{RESTAURANT_PHONE}</Text>
                              </View>

                              <View className="flex-row mt-4 gap-3">
                                  {heroFacts.map((fact) => (
                                      <View key={fact.label} className="flex-1 px-3 py-2 rounded-2xl bg-white/80">
                                          <Text className="text-sm font-quicksand-semibold" style={{color: '#E63946'}}>{fact.value}</Text>
                                          <Text className="text-[11px] text-gray-500 mt-1">{fact.label}</Text>
                                      </View>
                                  ))}
                              </View>
                          </View>
                      )}

                      {!isAuthenticated && showLoyaltyBanner && (
                          <View className="mb-4 px-1">
                              <LoyaltyBanner showOnHome={true} onDismiss={() => setShowLoyaltyBanner(false)} />
                          </View>
                      )}

                      <Text className="text-xl font-bold text-dark-100 mb-3">Nos offres spéciales</Text>
                  </Animated.View>
              )}
          />
      </SafeAreaView>
  );
}
