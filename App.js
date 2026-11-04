import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEYS = {
  recipes: '@foodie/my-recipes',
  favorites: '@foodie/favorites',
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=85';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegan',
  'Pasta',
  'Salad',
  'Seafood',
  'Soup',
  'Snacks',
  'Bakery',
  'Drinks',
  'Favorites',
  'My Food',
];

const RECIPES = [
  {
    id: '1',
    title: 'Avocado Breakfast Bowl',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=85',
    description: 'A bright, nourishing start with creamy avocado and crisp greens.',
    ingredients: ['1 ripe avocado', '2 eggs', '1 cup baby spinach', '1 slice sourdough', '1 tsp olive oil', 'Salt and pepper'],
    instructions: [
      'Toast the sourdough in a toaster or a dry pan over medium heat until the outside is crisp and golden. If you like, brush the warm toast with a little olive oil so it stays tender inside.',
      'Heat the olive oil in a skillet over medium heat. Add the baby spinach and stir for 1–2 minutes, just until the leaves wilt but remain bright green. Season lightly and transfer the spinach to your serving bowl.',
      'Cook the eggs in the same pan: fry for about 2–3 minutes for a soft yolk, or cover the pan briefly if you prefer the whites fully set. For poached eggs, simmer them gently in water until the whites are set. Season with salt and pepper.',
      'Cut the avocado in half, remove the pit, and slice the flesh. Place the toast and spinach in the bowl, add the eggs and avocado, and finish with freshly ground pepper. Serve while the toast and eggs are warm.',
    ],
    prepTime: 15,
    servings: 1,
    calories: 420,
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Lemon Herb Chicken',
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1000&q=85',
    description: 'Juicy skillet chicken with lemon, garlic, and fresh herbs.',
    ingredients: ['2 chicken breasts', '1 lemon', '2 garlic cloves', '1 tbsp olive oil', '1 tsp dried oregano', 'Fresh parsley'],
    instructions: [
      'Pat the chicken breasts dry with paper towels. If they are unevenly thick, gently flatten the thicker end so they cook evenly. Season both sides with oregano, salt, and pepper, then zest the lemon before cutting it in half.',
      'Warm the olive oil in a large skillet over medium heat. Lay the chicken in the pan and leave it undisturbed for 5–6 minutes so a golden crust forms. Turn the pieces and cook for another 5–6 minutes; thicker breasts may need a little longer.',
      'Check the thickest part with a food thermometer; chicken is ready at 74°C (165°F). Lower the heat, stir the minced garlic into the pan juices, then add the lemon juice and a small splash of water. Simmer for about a minute, scraping up the browned bits.',
      'Take the skillet off the heat and let the chicken rest for 3 minutes so the juices settle. Spoon the lemon-garlic pan sauce over the top, scatter with chopped parsley, and serve with the remaining lemon wedges.',
    ],
    prepTime: 30,
    servings: 2,
    calories: 385,
    difficulty: 'Easy',
  },
  {
    id: '3',
    title: 'Creamy Mushroom Pasta',
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1000&q=85',
    description: 'Silky parmesan sauce and golden mushrooms tossed with pasta.',
    ingredients: ['250 g fettuccine', '200 g mushrooms', '150 ml cream', '2 garlic cloves', '40 g parmesan', '1 tbsp butter'],
    instructions: [
      'Bring a large pot of water to a boil, salt it generously, and cook the fettuccine according to the package instructions until just al dente. Before draining, scoop out about ½ cup of the starchy pasta water.',
      'While the pasta cooks, clean the mushrooms and slice them evenly. Melt the butter in a wide skillet over medium-high heat, add the mushrooms in a single layer, and cook for 5–7 minutes until their moisture evaporates and the edges turn golden.',
      'Reduce the heat to medium. Stir in the minced garlic and cook for about 30 seconds, just until fragrant. Pour in the cream, season with salt and black pepper, and let the sauce gently bubble for 2–3 minutes until it lightly coats a spoon.',
      'Add the drained pasta and grated parmesan to the skillet. Toss continuously, adding reserved pasta water a tablespoon at a time until the sauce is glossy and clings to the noodles. Taste, adjust the seasoning, and serve immediately with extra parmesan.',
    ],
    prepTime: 25,
    servings: 2,
    calories: 560,
    difficulty: 'Medium',
  },
  {
    id: '4',
    title: 'Berry Yogurt Parfait',
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1000&q=85',
    description: 'Layers of berries, honeyed yogurt, and crunchy granola.',
    ingredients: ['250 g Greek yogurt', '1 cup mixed berries', '½ cup granola', '1 tbsp honey', '1 tsp chia seeds'],
    instructions: [
      'Rinse the berries and pat them dry. If the strawberries are large, remove their stems and cut them into bite-sized pieces. In a separate bowl, stir the honey into the Greek yogurt until the sweetness is evenly distributed.',
      'Spoon a layer of yogurt into the bottom of two clear glasses or jars. Keep the sides of the glasses clean so the colorful layers will show through.',
      'Add a layer of mixed berries, followed by a thin layer of granola. Press the ingredients down gently rather than packing them tightly, so the layers remain light and distinct.',
      'Repeat the yogurt, berry, and granola layers. Sprinkle the chia seeds over the top and finish with a few whole berries. Serve right away for crunchy granola, or refrigerate the yogurt and berries and add the granola just before serving.',
    ],
    prepTime: 10,
    servings: 2,
    calories: 290,
    difficulty: 'Easy',
  },
  {
    id: '5',
    title: 'Roasted Veggie Grain Bowl',
    category: 'Vegan',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=1000&q=85',
    description: 'Colorful roasted vegetables over hearty quinoa with tahini.',
    ingredients: ['1 cup quinoa', '1 sweet potato', '1 red bell pepper', '1 zucchini', '2 tbsp tahini', '1 tbsp lemon juice'],
    instructions: [
      'Heat the oven to 220°C (425°F) and line a baking tray with parchment. Rinse the quinoa in a fine sieve. Put it in a saucepan with the amount of water stated on its package, bring to a boil, then cover and simmer until the grains are tender and the water is absorbed.',
      'Peel the sweet potato and cut it into small, even cubes. Cut the bell pepper and zucchini into similar-sized pieces so they roast at roughly the same rate. Spread everything on the tray, toss with olive oil, salt, and pepper, and leave space between the vegetables.',
      'Roast for 20–25 minutes, turning the vegetables once halfway through. The sweet potato should be fork-tender and the pepper and zucchini lightly browned at the edges. Fluff the cooked quinoa with a fork while the vegetables finish.',
      'Whisk the tahini with lemon juice and one tablespoon of water. Add more water a little at a time until the sauce is smooth and pourable, then season to taste. Divide quinoa between bowls, arrange the roasted vegetables on top, and drizzle with the lemon-tahini sauce.',
    ],
    prepTime: 35,
    servings: 2,
    calories: 470,
    difficulty: 'Easy',
  },
  {
    id: '6',
    title: 'Garden Crunch Salad',
    category: 'Salad',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&q=85',
    description: 'Fresh greens, cucumber, tomatoes, and a zippy vinaigrette.',
    ingredients: ['4 cups mixed greens', '1 cucumber', '1 cup cherry tomatoes', '¼ red onion', '2 tbsp olive oil', '1 tbsp red wine vinegar'],
    instructions: [
      'In a small bowl, whisk together the olive oil and red wine vinegar. Add a pinch of salt and several turns of black pepper; taste the dressing and adjust the balance with a little more vinegar or oil if needed.',
      'Wash and thoroughly dry the mixed greens so the dressing will cling to them. Slice the cucumber into thin rounds, halve the cherry tomatoes, and cut the red onion into very thin slices.',
      'Put the cucumber, tomatoes, and onion into a large salad bowl. Pour over about half of the dressing and toss so the vegetables begin to absorb the flavor.',
      'Add the greens and toss gently with your hands or salad servers. Taste a leaf and add more dressing only if needed; serve immediately so the greens stay crisp.',
    ],
    prepTime: 12,
    servings: 2,
    calories: 210,
    difficulty: 'Easy',
  },
  {
    id: '7',
    title: 'Garlic Butter Salmon',
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&q=85',
    description: 'Tender salmon with a quick garlic butter and lemon pan sauce.',
    ingredients: ['2 salmon fillets', '2 tbsp butter', '2 garlic cloves', '½ lemon', '1 tbsp chopped dill', 'Salt and pepper'],
    instructions: [
      'Pat the salmon fillets dry and check for any pin bones. Season both sides with salt and pepper. Let the fish sit at room temperature for about 10 minutes while you prepare the lemon and garlic.',
      'Heat a nonstick or well-seasoned skillet over medium heat, then add a small amount of oil. Place the fillets skin-side down and press gently with a spatula for the first 10 seconds so the skin makes good contact. Cook for about 4–5 minutes, until the skin is crisp and the color has turned opaque about halfway up the sides.',
      'Turn the fillets carefully. Add the butter and finely chopped garlic to the pan and cook for another 3–4 minutes, tilting the skillet and spooning the melted garlic butter over the fish. Avoid letting the garlic become dark brown.',
      'The salmon is ready when it flakes easily and reaches 63°C (145°F) in the thickest part. Turn off the heat, squeeze in the lemon juice, and stir in the dill. Spoon the sauce over the fillets and serve immediately.',
    ],
    prepTime: 20,
    servings: 2,
    calories: 430,
    difficulty: 'Medium',
  },
  {
    id: '8',
    title: 'Tomato Basil Soup',
    category: 'Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=85',
    description: 'A cozy tomato soup finished with basil and a swirl of cream.',
    ingredients: ['800 g canned tomatoes', '1 small onion', '2 garlic cloves', '500 ml vegetable stock', '1 handful fresh basil', '2 tbsp cream'],
    instructions: [
      'Dice the onion finely. Warm a tablespoon of olive oil in a large saucepan over medium heat, add the onion with a pinch of salt, and cook for about 5 minutes, stirring often, until soft and translucent rather than browned.',
      'Stir in the chopped garlic and cook for 30 seconds until fragrant. Add the canned tomatoes, gently breaking up any whole tomatoes with a wooden spoon, and cook for another 2 minutes.',
      'Pour in the vegetable stock and bring the soup to a gentle simmer. Partially cover the saucepan and cook for about 15 minutes so the flavors meld. Stir occasionally and reduce the heat if the soup begins to boil vigorously.',
      'Remove the pan from the heat before blending. Use an immersion blender until smooth, or carefully blend in small batches, keeping the blender lid vented and covered with a towel because hot soup releases steam. Stir in torn basil and cream, taste for salt and pepper, and serve warm.',
    ],
    prepTime: 30,
    servings: 4,
    calories: 180,
    difficulty: 'Easy',
  },
  {
    id: '9',
    title: 'Crispy Chickpea Bites',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&q=85',
    description: 'Crunchy, smoky roasted chickpeas for an easy savory snack.',
    ingredients: ['1 can chickpeas', '1 tbsp olive oil', '½ tsp smoked paprika', '¼ tsp garlic powder', 'Salt to taste'],
    instructions: [
      'Heat the oven to 200°C (400°F) and line a baking tray with parchment. Drain and rinse the chickpeas, then spread them on a clean kitchen towel and pat thoroughly dry. Removing surface moisture is the key to getting them crisp.',
      'Pick off any loose chickpea skins if they come away easily. Tip the dried chickpeas into a bowl and toss with olive oil, smoked paprika, garlic powder, and salt until every chickpea is lightly coated.',
      'Spread the chickpeas in a single layer with space between them. Roast for 25–30 minutes, shaking the tray after about 15 minutes, until golden and crisp on the outside. Start checking a little early because oven temperatures can vary.',
      'Let the chickpeas cool on the tray for 5 minutes; they become crunchier as they cool. Taste and add another small pinch of salt if needed. Enjoy the same day for the best texture, or store completely cooled chickpeas in a loosely covered container.',
    ],
    prepTime: 35,
    servings: 3,
    calories: 160,
    difficulty: 'Easy',
  },
  {
    id: '10',
    title: 'No-Knead Rustic Bread',
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=85',
    description: 'A crisp crust and soft center with very little hands-on work.',
    ingredients: ['3 cups bread flour', '1½ cups warm water', '1 tsp instant yeast', '1½ tsp salt'],
    instructions: [
      'In a large bowl, stir together the flour, instant yeast, and salt. Pour in the warm water and mix with a sturdy spoon until no dry patches remain; the dough will look rough and sticky. Cover the bowl tightly.',
      'Leave the covered dough at room temperature for 8–12 hours, until it has roughly doubled and the surface is full of small bubbles. A cooler room may require more time; rely on the dough’s appearance as well as the clock.',
      'Lightly flour a work surface and your hands. Turn out the dough, fold its edges toward the center a few times to form a loose ball, and place it seam-side down on parchment. Cover with a towel and let it rest while the oven heats to 230°C (450°F) with a lidded Dutch oven inside.',
      'Carefully remove the hot Dutch oven using oven mitts. Lift the dough in by the parchment, cover, and bake for 30 minutes. Remove the lid and bake another 12–15 minutes until deeply golden. Transfer the loaf to a rack and let it cool for at least 30 minutes before slicing.',
    ],
    prepTime: 55,
    servings: 8,
    calories: 190,
    difficulty: 'Medium',
  },
  {
    id: '11',
    title: 'Mango Sunrise Smoothie',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=1000&q=85',
    description: 'A sunny, refreshing mango and orange smoothie.',
    ingredients: ['1 cup frozen mango', '1 orange, peeled', '½ banana', '½ cup Greek yogurt', '½ cup cold water'],
    instructions: [
      'Peel the orange and remove any seeds. Add the frozen mango, orange segments, banana, Greek yogurt, and half of the cold water to a blender jar. Keeping a little water back makes it easier to control the final thickness.',
      'Secure the lid and blend on low for a few seconds, then increase to high until the fruit is broken down. Stop the blender and scrape down the sides if any pieces are stuck, then blend again until smooth and creamy.',
      'Check the consistency: blend in the remaining water a tablespoon at a time for a thinner drink, or add a little extra frozen mango for a thicker one. Taste and adjust to your liking.',
      'Pour into a chilled glass and serve straight away while the smoothie is cold. Rinse the blender jar promptly so the yogurt and fruit do not dry onto the sides.',
    ],
    prepTime: 5,
    servings: 1,
    calories: 240,
    difficulty: 'Easy',
  },
  {
    id: '12',
    title: 'One-Pan Roast Chicken',
    category: 'Dinner',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=1000&q=85',
    description: 'Golden roast chicken and potatoes made together in one pan.',
    ingredients: ['4 chicken thighs', '500 g baby potatoes', '1 red onion', '2 tbsp olive oil', '1 tsp rosemary', '1 lemon'],
    instructions: [
      'Heat the oven to 210°C (410°F). Pat the chicken thighs dry and season them on all sides with salt and pepper. Halve the baby potatoes; cut any especially large ones into quarters so all the pieces cook evenly.',
      'Place the potatoes and sliced red onion in a roasting pan. Toss with olive oil, rosemary, salt, and pepper until coated, then spread them out. Squeeze a little lemon juice over the vegetables and add the squeezed lemon halves to the pan for extra aroma.',
      'Arrange the chicken thighs skin-side up among the vegetables, leaving a little room around each piece so the skin can brown. Roast uncovered for 35–40 minutes. If the potatoes are browning too quickly, turn them gently and move them away from the hottest part of the pan.',
      'Check that the thickest part of each thigh reaches 74°C (165°F) without touching bone. The skin should be golden and the potatoes tender when pierced with a knife. Rest the chicken for 5 minutes, spoon the pan juices over everything, and serve with fresh lemon.',
    ],
    prepTime: 50,
    servings: 4,
    calories: 520,
    difficulty: 'Medium',
  },
];

const EMPTY_FORM = {
  title: '',
  category: 'My Recipes',
  image: '',
  ingredientsText: '',
  instructionsText: '',
  prepTime: '30',
  servings: '2',
  calories: '350',
  difficulty: 'Easy',
};

function IconButton({ name, onPress, color = COLORS.ink, size = 22, style }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={[styles.iconButton, style]}>
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

const COLORS = {
  background: '#F8F7F2',
  white: '#FFFFFF',
  ink: '#20251F',
  muted: '#777D73',
  green: '#315B46',
  paleGreen: '#E7EEE5',
  orange: '#F2A65A',
  line: '#E8E8E1',
  red: '#D85A4A',
};

function RecipeCard({ recipe, onPress, isFavorite, onToggleFavorite, compact = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.recipeCard, compact && styles.compactCard]}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: recipe.image || DEFAULT_IMAGE }} style={styles.cardImage} />
        <View style={styles.cardCategory}>
          <Text style={styles.cardCategoryText}>{recipe.category}</Text>
        </View>
        {onToggleFavorite ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            style={styles.heartButton}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={19} color={isFavorite ? COLORS.red : COLORS.ink} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{recipe.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{recipe.description || 'A homemade favorite, ready to enjoy.'}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="time-outline" size={14} color={COLORS.muted} />
          <Text style={styles.cardMetaText}>{recipe.prepTime || 30} min</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.cardMetaText}>{recipe.difficulty || 'Easy'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [returnScreen, setReturnScreen] = useState('home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [favorites, setFavorites] = useState(['1']);
  const [isHydrated, setIsHydrated] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const allRecipes = useMemo(() => [...customRecipes, ...RECIPES], [customRecipes]);

  useEffect(() => {
    async function loadSavedData() {
      try {
        const [savedRecipes, savedFavorites] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.recipes),
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
        ]);
        if (savedRecipes !== null) {
          const parsedRecipes = JSON.parse(savedRecipes);
          if (!Array.isArray(parsedRecipes)) throw new Error('Saved recipes are not a list.');
          setCustomRecipes(parsedRecipes);
        }
        if (savedFavorites !== null) {
          const parsedFavorites = JSON.parse(savedFavorites);
          if (!Array.isArray(parsedFavorites)) throw new Error('Saved favorites are not a list.');
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Could not load saved Foodie data:', error);
        Alert.alert('Saved data unavailable', 'Your recipes could not be loaded from this device.');
      } finally {
        setIsHydrated(true);
      }
    }
    loadSavedData();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(customRecipes)).catch((error) => {
      console.error('Could not save your recipes:', error);
      Alert.alert('Save failed', 'Your recipe changes could not be saved on this device.');
    });
  }, [customRecipes, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites)).catch((error) => {
      console.error('Could not save favorites:', error);
      Alert.alert('Save failed', 'Your favorites could not be saved on this device.');
    });
  }, [favorites, isHydrated]);

  useEffect(() => {
    if (screen === 'home' || Platform.OS === 'web') return undefined;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => subscription.remove();
  }, [screen, returnScreen]);

  const homeRecipes = useMemo(() => {
    let result = allRecipes;
    if (activeCategory !== 'All') result = result.filter((recipe) => recipe.category === activeCategory);
    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      result = result.filter((recipe) => recipe.title.toLowerCase().includes(query));
    }
    return result;
  }, [activeCategory, allRecipes, searchText]);

  function toggleFavorite(id) {
    setFavorites((current) => (
      current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]
    ));
  }

  function openRecipe(recipe, source) {
    setSelectedRecipe(recipe);
    setReturnScreen(source);
    setScreen('detail');
  }

  function goBack() {
    if (screen === 'detail') {
      setScreen(returnScreen);
    } else if (screen === 'form') {
      setScreen('myRecipes');
    } else if (screen === 'favorites' || screen === 'myRecipes') {
      setScreen('home');
      setActiveCategory('All');
    } else if (screen !== 'home') {
      setScreen('home');
    }
  }

  function beginNewRecipe() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setScreen('form');
  }

  function beginEditing(recipe) {
    setEditingId(recipe.id);
    setForm({
      title: recipe.title || '',
      category: recipe.category || 'My Recipes',
      image: recipe.image || '',
      ingredientsText: (recipe.ingredients || []).join('\n'),
      instructionsText: (recipe.instructions || []).join('\n'),
      prepTime: String(recipe.prepTime || 30),
      servings: String(recipe.servings || 2),
      calories: String(recipe.calories || 350),
      difficulty: recipe.difficulty || 'Easy',
    });
    setScreen('form');
  }

  async function chooseImage() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Photo access needed', 'Allow photo library access to choose a recipe image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setForm((current) => ({ ...current, image: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Could not choose a recipe image:', error);
      Alert.alert('Image picker unavailable', 'The photo library could not be opened. Please try again.');
    }
  }

  function saveRecipe() {
    const ingredients = form.ingredientsText.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    const instructions = form.instructionsText.split(/\n+/).map((item) => item.trim()).filter(Boolean);
    if (!form.title.trim() || ingredients.length === 0 || instructions.length === 0) {
      Alert.alert('Missing recipe details', 'Add a recipe name, at least one ingredient, and step-by-step instructions.');
      return;
    }
    const recipe = {
      id: editingId || `custom-${Date.now()}`,
      title: form.title.trim(),
      category: form.category.trim() || 'My Recipes',
      image: form.image || DEFAULT_IMAGE,
      description: 'A homemade recipe from your collection.',
      ingredients,
      instructions,
      prepTime: Number(form.prepTime) || 30,
      servings: Number(form.servings) || 2,
      calories: Number(form.calories) || 350,
      difficulty: form.difficulty.trim() || 'Easy',
    };
    if (editingId) {
      setCustomRecipes((current) => current.map((item) => item.id === editingId ? recipe : item));
    } else {
      setCustomRecipes((current) => [recipe, ...current]);
    }
    setScreen('myRecipes');
  }

  function confirmDelete(recipe) {
    Alert.alert('Delete recipe?', `“${recipe.title}” will be removed from My Recipes.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setCustomRecipes((current) => current.filter((item) => item.id !== recipe.id));
          setFavorites((current) => current.filter((id) => id !== recipe.id));
          if (selectedRecipe && selectedRecipe.id === recipe.id) setScreen('myRecipes');
        },
      },
    ]);
  }

  function renderHeader(title, rightAction) {
    return (
      <View style={styles.subHeader}>
        <IconButton name="arrow-back" onPress={goBack} style={styles.backButton} />
        <Text style={styles.subHeaderTitle}>{title}</Text>
        {rightAction || <View style={styles.headerSpacer} />}
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        <ScrollView style={styles.screenScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContent}>
          <View style={styles.homeHeader}>
            <View>
              <Text style={styles.eyebrow}>GOOD FOOD, GOOD MOOD</Text>
              <Text style={styles.brandTitle}>Foodie<Text style={styles.brandDot}>.</Text></Text>
            </View>
            <Pressable onPress={() => setScreen('favorites')} style={styles.headerFavorite}>
              <Ionicons name="heart" size={20} color={COLORS.red} />
              <Text style={styles.headerFavoriteText}>Favorites</Text>
            </Pressable>
          </View>
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroKicker}>COOK SOMETHING LOVELY</Text>
              <Text style={styles.heroTitle}>A little inspiration{'\n'}for your next meal.</Text>
              <Text style={styles.heroSubtitle}>Fresh ideas, made for real life.</Text>
            </View>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=85' }}
              style={styles.heroImage}
            />
          </View>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Explore recipes</Text>
              <Text style={styles.sectionSubtitle}>Find your next favorite</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((category) => {
              const isSelected = category === activeCategory;
              return (
                <Pressable
                  key={category}
                  onPress={() => {
                    if (category === 'Favorites') {
                      setScreen('favorites');
                    } else if (category === 'My Food') {
                      setScreen('myRecipes');
                    } else {
                      setActiveCategory(category);
                    }
                  }}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>{category}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color={COLORS.muted} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search a recipe"
              placeholderTextColor="#9A9D96"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchText ? <IconButton name="close-circle" size={18} color={COLORS.muted} onPress={() => setSearchText('')} /> : null}
          </View>
          <View style={styles.resultsHeading}>
            <Text style={styles.sectionTitle}>{activeCategory === 'All' ? 'Popular today' : activeCategory}</Text>
            <Text style={styles.resultCount}>{homeRecipes.length} recipes</Text>
          </View>
          <View style={styles.recipeGrid}>
            {homeRecipes.length ? homeRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => openRecipe(recipe, 'home')}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
              />
            )) : (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={34} color={COLORS.green} />
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptyText}>Try another category or search term.</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerText}>Made with love and a little seasoning.</Text>
        </ScrollView>
      </>
    );
  }

  function renderFavorites() {
    const savedRecipes = allRecipes.filter((recipe) => favorites.includes(recipe.id));
    return (
      <View style={styles.screen}>
        {renderHeader('Favorites')}
        <ScrollView style={styles.screenScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageIntro}>All the recipes you have saved for later.</Text>
          {savedRecipes.length ? savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => openRecipe(recipe, 'favorites')}
              isFavorite
              onToggleFavorite={() => toggleFavorite(recipe.id)}
              compact
            />
          )) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={38} color={COLORS.green} />
              <Text style={styles.emptyTitle}>Your favorites are waiting</Text>
              <Text style={styles.emptyText}>Tap a recipe’s heart to save it here.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  function renderMyRecipes() {
    return (
      <View style={styles.screen}>
        {renderHeader('My Recipes', (
          <Pressable onPress={beginNewRecipe} style={styles.addButton}>
            <Ionicons name="add" size={18} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add new</Text>
          </Pressable>
        ))}
        <ScrollView style={styles.screenScroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageIntro}>Your own recipes, all in one place.</Text>
          <Pressable onPress={beginNewRecipe} style={styles.addRecipeBanner}>
            <View style={styles.addBannerIcon}><Ionicons name="create-outline" size={22} color={COLORS.green} /></View>
            <View style={styles.addBannerCopy}>
              <Text style={styles.addBannerTitle}>Add a new recipe</Text>
              <Text style={styles.addBannerSubtitle}>Save a dish you love to make</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.green} />
          </Pressable>
          {customRecipes.length ? customRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.myRecipeItem}>
              <RecipeCard
                recipe={recipe}
                onPress={() => openRecipe(recipe, 'myRecipes')}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
                compact
              />
              <View style={styles.recipeActions}>
                <Pressable onPress={() => beginEditing(recipe)} style={styles.editButton}>
                  <Ionicons name="create-outline" size={17} color={COLORS.green} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => confirmDelete(recipe)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={17} color={COLORS.red} />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={38} color={COLORS.green} />
              <Text style={styles.emptyTitle}>Your recipe book is empty</Text>
              <Text style={styles.emptyText}>Add your first recipe and it will appear here.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  function renderDetail() {
    if (!selectedRecipe) return null;
    const recipe = allRecipes.find((item) => item.id === selectedRecipe.id) || selectedRecipe;
    const isCustom = customRecipes.some((item) => item.id === recipe.id);
    const isFavorite = favorites.includes(recipe.id);
    return (
      <View style={styles.screen}>
        <View style={styles.detailTopBar}>
          <IconButton name="arrow-back" onPress={goBack} style={styles.detailBack} />
          <Text style={styles.detailTopTitle}>Recipe details</Text>
          <IconButton
            name={isFavorite ? 'heart' : 'heart-outline'}
            color={isFavorite ? COLORS.red : COLORS.ink}
            onPress={() => toggleFavorite(recipe.id)}
            style={styles.detailHeart}
          />
        </View>
        <ScrollView style={styles.screenScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
          <Image source={{ uri: recipe.image || DEFAULT_IMAGE }} style={styles.detailImage} />
          <View style={styles.detailTitleRow}>
            <View style={styles.detailTitleCopy}>
              <Text style={styles.detailCategory}>{recipe.category}</Text>
              <Text style={styles.detailTitle}>{recipe.title}</Text>
              <Text style={styles.detailDescription}>{recipe.description || 'A homemade favorite, ready to enjoy.'}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={19} color={COLORS.green} />
              <Text style={styles.statValue}>{recipe.prepTime || 30} min</Text>
              <Text style={styles.statLabel}>Cook time</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="people-outline" size={19} color={COLORS.green} />
              <Text style={styles.statValue}>{recipe.servings || 2}</Text>
              <Text style={styles.statLabel}>Servings</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flame-outline" size={19} color={COLORS.green} />
              <Text style={styles.statValue}>{recipe.calories || 350}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="bar-chart-outline" size={19} color={COLORS.green} />
              <Text style={styles.statValue}>{recipe.difficulty || 'Easy'}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>
          {isCustom ? (
            <View style={styles.detailActions}>
              <Pressable onPress={() => beginEditing(recipe)} style={styles.editButton}>
                <Ionicons name="create-outline" size={17} color={COLORS.green} />
                <Text style={styles.editButtonText}>Edit recipe</Text>
              </Pressable>
              <Pressable onPress={() => confirmDelete(recipe)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={17} color={COLORS.red} />
                <Text style={styles.deleteButtonText}>Delete recipe</Text>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Ingredients</Text>
            {(recipe.ingredients || []).map((ingredient, index) => (
              <View key={`${ingredient}-${index}`} style={styles.ingredientRow}>
                <View style={styles.ingredientBullet}><Ionicons name="checkmark" size={13} color={COLORS.green} /></View>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Instructions</Text>
            {(recipe.instructions || []).map((instruction, index) => (
              <View key={`${instruction}-${index}`} style={styles.instructionRow}>
                <Text style={styles.instructionStepLabel}>Step {index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={goBack} style={styles.backToRecipes}>
            <Ionicons name="arrow-back" size={17} color={COLORS.green} />
            <Text style={styles.backToRecipesText}>Back to recipes</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  function renderForm() {
    function updateField(key, value) {
      setForm((current) => ({ ...current, [key]: value }));
    }
    return (
      <View style={styles.screen}>
        {renderHeader(editingId ? 'Edit Recipe' : 'Add New Recipe', (
          <Pressable onPress={saveRecipe} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save recipe</Text>
          </Pressable>
        ))}
        <KeyboardAvoidingView
          style={styles.formKeyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 92 : 0}
        >
          <ScrollView style={styles.screenScroll} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.formIntro}>A few details are all you need to keep a recipe close.</Text>
            <Text style={styles.fieldLabel}>Recipe name *</Text>
            <TextInput
              value={form.title}
              onChangeText={(value) => updateField('title', value)}
              placeholder="e.g. Sunday tomato pasta"
              placeholderTextColor="#9A9D96"
              style={styles.textField}
              maxLength={70}
            />
            <Text style={styles.fieldLabel}>Recipe image</Text>
            <Pressable onPress={chooseImage} style={styles.imagePicker}>
              {form.image ? <Image source={{ uri: form.image }} style={styles.pickedImage} /> : (
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="image-outline" size={25} color={COLORS.green} />
                  <Text style={styles.imagePickerTitle}>Choose an image</Text>
                  <Text style={styles.imagePickerSubtitle}>Select a photo from your library</Text>
                </View>
              )}
              {form.image ? <View style={styles.changeImageLabel}><Ionicons name="camera-outline" size={15} color={COLORS.white} /><Text style={styles.changeImageText}>Change photo</Text></View> : null}
            </Pressable>
            <Text style={styles.fieldLabel}>Category</Text>
            <TextInput
              value={form.category}
              onChangeText={(value) => updateField('category', value)}
              placeholder="My Recipes"
              placeholderTextColor="#9A9D96"
              style={styles.textField}
            />
            <Text style={styles.fieldLabel}>Ingredients * <Text style={styles.fieldHint}>one per line</Text></Text>
            <TextInput
              value={form.ingredientsText}
              onChangeText={(value) => updateField('ingredientsText', value)}
              placeholder={'2 cups flour\n1 cup milk\n2 eggs'}
              placeholderTextColor="#9A9D96"
              style={[styles.textField, styles.multilineField]}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.fieldLabel}>Step-by-step instructions * <Text style={styles.fieldHint}>one step per line</Text></Text>
            <TextInput
              value={form.instructionsText}
              onChangeText={(value) => updateField('instructionsText', value)}
              placeholder={'Mix the dry ingredients.\nAdd milk and eggs, then stir.\nCook until golden.'}
              placeholderTextColor="#9A9D96"
              style={[styles.textField, styles.multilineField, styles.instructionsField]}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.optionalHeading}>
              <Text style={styles.fieldLabel}>Recipe details</Text>
              <Text style={styles.fieldHint}>optional</Text>
            </View>
            <View style={styles.formStatsRow}>
              <View style={styles.formStatField}>
                <Text style={styles.fieldLabel}>Time (min)</Text>
                <TextInput value={form.prepTime} onChangeText={(value) => updateField('prepTime', value)} keyboardType="number-pad" style={styles.textField} />
              </View>
              <View style={styles.formStatField}>
                <Text style={styles.fieldLabel}>Servings</Text>
                <TextInput value={form.servings} onChangeText={(value) => updateField('servings', value)} keyboardType="number-pad" style={styles.textField} />
              </View>
              <View style={styles.formStatField}>
                <Text style={styles.fieldLabel}>Calories</Text>
                <TextInput value={form.calories} onChangeText={(value) => updateField('calories', value)} keyboardType="number-pad" style={styles.textField} />
              </View>
            </View>
            <Text style={styles.fieldLabel}>Difficulty</Text>
            <View style={styles.difficultyRow}>
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => updateField('difficulty', level)}
                  style={[styles.difficultyChip, form.difficulty === level && styles.difficultyChipSelected]}
                >
                  <Text style={[styles.difficultyText, form.difficulty === level && styles.difficultyTextSelected]}>{level}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={saveRecipe} style={styles.formSaveButton}>
              <Text style={styles.formSaveButtonText}>{editingId ? 'Save changes' : 'Save recipe'}</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {screen === 'home' ? renderHome() : null}
      {screen === 'favorites' ? renderFavorites() : null}
      {screen === 'myRecipes' ? renderMyRecipes() : null}
      {screen === 'detail' ? renderDetail() : null}
      {screen === 'form' ? renderForm() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, minHeight: 0, height: Platform.OS === 'web' ? '100vh' : undefined, width: '100%', maxWidth: 560, alignSelf: 'center', backgroundColor: COLORS.background, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  screen: { flex: 1, minHeight: 0, backgroundColor: COLORS.background },
  screenScroll: { flex: 1, minHeight: 0 },
  homeContent: { paddingHorizontal: 20, paddingBottom: 36 },
  homeHeader: { paddingTop: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 10, letterSpacing: 1.8, fontWeight: '700', color: COLORS.green },
  brandTitle: { marginTop: 2, color: COLORS.ink, fontSize: 31, fontWeight: '800', letterSpacing: -1.2 },
  brandDot: { color: COLORS.orange },
  headerFavorite: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: COLORS.white, borderRadius: 22, paddingVertical: 10, paddingHorizontal: 13 },
  headerFavoriteText: { color: COLORS.ink, fontSize: 13, fontWeight: '600' },
  hero: { minHeight: 177, borderRadius: 22, backgroundColor: COLORS.paleGreen, padding: 18, overflow: 'hidden', flexDirection: 'row', alignItems: 'center' },
  heroCopy: { flex: 1, zIndex: 1 },
  heroKicker: { color: COLORS.green, fontSize: 9, letterSpacing: 1.1, fontWeight: '800' },
  heroTitle: { color: COLORS.ink, fontSize: 20, lineHeight: 26, fontWeight: '800', marginTop: 8 },
  heroSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 7 },
  heroImage: { position: 'absolute', right: -24, bottom: 0, width: 145, height: 177, borderTopLeftRadius: 100, opacity: 0.9 },
  sectionHeading: { marginTop: 25, marginBottom: 14 },
  sectionTitle: { color: COLORS.ink, fontSize: 19, fontWeight: '700' },
  sectionSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  categoryRow: { paddingBottom: 14, gap: 8 },
  categoryChip: { paddingVertical: 9, paddingHorizontal: 15, backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line },
  categoryChipSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: COLORS.muted },
  categoryChipTextSelected: { color: COLORS.white },
  searchBox: { minHeight: 48, borderRadius: 14, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, marginBottom: 23 },
  searchInput: { flex: 1, paddingVertical: 11, paddingHorizontal: 9, fontSize: 14, color: COLORS.ink },
  resultsHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  resultCount: { fontSize: 12, color: COLORS.muted },
  recipeGrid: { gap: 14 },
  recipeCard: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EFEFEA' },
  compactCard: { marginBottom: 3 },
  cardImageWrap: { height: 174, position: 'relative', backgroundColor: COLORS.paleGreen },
  cardImage: { width: '100%', height: '100%' },
  cardCategory: { position: 'absolute', left: 12, top: 12, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: 'rgba(255,255,255,0.94)' },
  cardCategoryText: { fontSize: 10, color: COLORS.green, fontWeight: '700' },
  heartButton: { position: 'absolute', right: 12, top: 11, width: 35, height: 35, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  cardDescription: { marginTop: 5, fontSize: 12, lineHeight: 18, color: COLORS.muted },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 11, gap: 6 },
  cardMetaText: { fontSize: 11, color: COLORS.muted, fontWeight: '500' },
  metaDot: { color: COLORS.orange, fontWeight: '800' },
  iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  subHeader: { minHeight: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.line, backgroundColor: COLORS.background },
  backButton: { marginLeft: -7 },
  subHeaderTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: COLORS.ink },
  headerSpacer: { width: 40 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.green, paddingHorizontal: 11, paddingVertical: 9, borderRadius: 18 },
  addButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 11 },
  listContent: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 34, gap: 13 },
  pageIntro: { fontSize: 13, color: COLORS.muted, marginBottom: 2 },
  addRecipeBanner: { backgroundColor: COLORS.paleGreen, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 6 },
  addBannerIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  addBannerCopy: { flex: 1 },
  addBannerTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '700' },
  addBannerSubtitle: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  myRecipeItem: { marginBottom: 7 },
  recipeActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 9, marginTop: 8, marginBottom: 4 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#DCE6DA', borderWidth: 1, backgroundColor: COLORS.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  editButtonText: { color: COLORS.green, fontSize: 12, fontWeight: '700' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#F1D9D5', borderWidth: 1, backgroundColor: COLORS.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  deleteButtonText: { color: COLORS.red, fontSize: 12, fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 42, paddingHorizontal: 24, backgroundColor: COLORS.white, borderRadius: 18, marginTop: 8 },
  emptyTitle: { color: COLORS.ink, fontSize: 16, fontWeight: '700', marginTop: 13, textAlign: 'center' },
  emptyText: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 6, textAlign: 'center' },
  detailTopBar: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.line },
  detailBack: { marginLeft: -7 },
  detailTopTitle: { fontWeight: '700', color: COLORS.ink, fontSize: 15 },
  detailHeart: { marginRight: -7 },
  detailContent: { paddingBottom: 34 },
  detailImage: { width: '100%', height: 255, backgroundColor: COLORS.paleGreen },
  detailTitleRow: { paddingHorizontal: 21, paddingTop: 19 },
  detailTitleCopy: { flex: 1 },
  detailCategory: { color: COLORS.green, fontSize: 11, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase' },
  detailTitle: { color: COLORS.ink, fontSize: 25, lineHeight: 31, fontWeight: '800', marginTop: 6 },
  detailDescription: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginTop: 7 },
  statsRow: { marginHorizontal: 20, marginTop: 19, borderRadius: 16, backgroundColor: COLORS.white, paddingVertical: 14, paddingHorizontal: 7, flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderColor: COLORS.line },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: COLORS.ink, fontWeight: '700', fontSize: 12, marginTop: 5 },
  statLabel: { color: COLORS.muted, fontSize: 9, marginTop: 3 },
  detailActions: { flexDirection: 'row', gap: 9, justifyContent: 'flex-end', marginHorizontal: 20, marginTop: 14 },
  detailSection: { marginHorizontal: 21, marginTop: 25 },
  detailSectionTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '700', marginBottom: 13 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomColor: COLORS.line, borderBottomWidth: 1, gap: 11 },
  ingredientBullet: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.paleGreen, alignItems: 'center', justifyContent: 'center' },
  ingredientText: { color: COLORS.ink, fontSize: 13, flex: 1 },
  instructionRow: { marginBottom: 16 },
  instructionStepLabel: { color: COLORS.green, fontSize: 11, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 5 },
  instructionText: { color: COLORS.ink, fontSize: 14, lineHeight: 22 },
  backToRecipes: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 7, padding: 13, marginTop: 11 },
  backToRecipesText: { color: COLORS.green, fontSize: 13, fontWeight: '700' },
  formKeyboard: { flex: 1 },
  formContent: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 38 },
  formIntro: { color: COLORS.muted, fontSize: 13, lineHeight: 19, marginBottom: 17 },
  fieldLabel: { color: COLORS.ink, fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 13 },
  fieldHint: { fontSize: 10, color: COLORS.muted, fontWeight: '400' },
  textField: { minHeight: 46, paddingHorizontal: 13, paddingVertical: 11, borderColor: COLORS.line, borderWidth: 1, borderRadius: 12, backgroundColor: COLORS.white, color: COLORS.ink, fontSize: 13 },
  multilineField: { minHeight: 116, lineHeight: 20 },
  instructionsField: { minHeight: 140 },
  imagePicker: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, overflow: 'hidden', backgroundColor: COLORS.white, minHeight: 125 },
  imagePickerPlaceholder: { alignItems: 'center', justifyContent: 'center', minHeight: 125 },
  imagePickerTitle: { fontSize: 12, color: COLORS.green, fontWeight: '700', marginTop: 6 },
  imagePickerSubtitle: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  pickedImage: { width: '100%', height: 180 },
  changeImageLabel: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(32,37,31,0.7)', borderRadius: 16, paddingVertical: 7, paddingHorizontal: 10 },
  changeImageText: { color: COLORS.white, fontSize: 10, fontWeight: '600' },
  optionalHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 },
  formStatsRow: { flexDirection: 'row', gap: 9 },
  formStatField: { flex: 1 },
  difficultyRow: { flexDirection: 'row', gap: 9 },
  difficultyChip: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, paddingVertical: 9, paddingHorizontal: 18, backgroundColor: COLORS.white },
  difficultyChipSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  difficultyText: { color: COLORS.muted, fontSize: 12, fontWeight: '600' },
  difficultyTextSelected: { color: COLORS.white },
  saveButton: { backgroundColor: COLORS.green, borderRadius: 18, paddingVertical: 9, paddingHorizontal: 12 },
  saveButtonText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  formSaveButton: { backgroundColor: COLORS.green, borderRadius: 14, minHeight: 49, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
  formSaveButtonText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  footerText: { marginTop: 27, color: COLORS.muted, fontSize: 11, textAlign: 'center' },
});
