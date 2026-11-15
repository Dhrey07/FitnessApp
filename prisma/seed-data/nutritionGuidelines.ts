/**
 * ERICONET nutrition guidelines (brief section 13).
 * Fifteen topics in the brief's order. Markdown bodies, calm coach voice.
 * Edited in the database by the coach later; this is the starting content.
 */
export const NUTRITION_GUIDELINES: { slug: string; title: string; body: string }[] = [
  {
    slug: 'raw-vs-cooked-weights',
    title: 'Raw vs cooked food weights',
    body: `Your plan lists food quantities in grams, and it matters whether that gram figure is raw or cooked. Rice, pasta, oats, beans and yam absorb water as they cook, so 100 g of raw rice becomes roughly 250 to 300 g cooked. Meat and fish do the opposite and lose water, so 150 g of raw chicken breast ends up around 110 to 120 g cooked.

Unless a line says otherwise, **grains, beans and tubers are given cooked** and **meat, fish and eggs are given raw**. If you only have the other form, use these rough conversions: cooked rice or pasta ÷ 2.5 = raw; cooked beans ÷ 2.2 = raw; cooked chicken, beef or fish × 1.3 = raw.

Pick one method and stick with it. Consistency matters more than perfect accuracy, because your coach adjusts the plan from your weekly trend. A kitchen scale costs little and removes most of the guesswork. If you batch-cook, weigh the whole pot once cooked and divide by the number of portions.`,
  },
  {
    slug: 'water-intake',
    title: 'Water intake',
    body: `Aim for **30 to 35 ml of water per kilogram of bodyweight** each day. For an 80 kg adult that is about 2.4 to 2.8 litres, and more on hot days or training days. A simple target is a 75 cl bottle three to four times a day.

Thirst, dark urine and afternoon headaches usually mean you are behind. Pale-yellow urine most of the day means you are about right. Tea, coffee and the water in food all count, but sugary drinks do not, because the sugar changes the calorie picture.

Drinking a glass of water before meals makes it easier to stop at the planned portion, and it helps with the hunger that shows up when calories are lower. Keep water visible: a bottle on your desk or in the car does more than a reminder on your phone.`,
  },
  {
    slug: 'meal-timing',
    title: 'Meal timing',
    body: `Total daily intake decides your results. Meal timing decides how comfortable it feels. Your plan uses two to four eating occasions a day because that suits most people's work and family patterns, but you can move meals around as long as the day's totals stay the same.

Two timing rules do help. First, **spread protein across the day**, with 30 to 50 g at each main meal, because muscle repair responds better to protein given in portions than in one large hit. Second, eat a meal with carbohydrate and protein **within about two hours after training**, which supports recovery and reduces evening hunger.

If you prefer to skip breakfast, that is fine: move Meal 1 later and keep the rest of the day as planned. If you train very early, a small snack such as a banana or two dates before the session and the full meal after works well. Avoid very long gaps followed by very large meals, which often end in overeating.`,
  },
  {
    slug: 'protein-intake',
    title: 'Protein intake',
    body: `Protein is the most important number on your plan after calories. It protects muscle while you lose fat, supports muscle growth when you are training hard, and keeps you fuller than carbohydrate or fat for the same calories. Your target is set at **1.6 to 2.2 g per kilogram of bodyweight**, depending on your goal.

Good sources include chicken, turkey, beef, goat meat, fish such as tilapia, mackerel and titus, eggs, Greek yoghurt, milk, beans, moi moi, akara (grilled or baked rather than deep-fried), tofu and whey protein. Many traditional dishes are carbohydrate-heavy with a small piece of protein, so the usual fix is simply more fish or meat and slightly less rice or swallow.

Hitting the protein target consistently is the habit that most separates clients who keep their results from those who do not. If a day goes wrong, protect protein first and let the other numbers flex.`,
  },
  {
    slug: 'vegetables-and-fruit',
    title: 'Vegetables and fruit',
    body: `Vegetables add volume, fibre, vitamins and minerals for very few calories, which makes them your main tool for feeling full in a deficit. Aim for **at least two fist-sized servings of vegetables at each main meal** and one to three pieces of fruit a day.

Ugu, spinach, waterleaf, okra, garden egg, cabbage, carrots, cucumber, tomatoes, peppers and onions are all excellent. Vegetable soups such as efo riro and edikang ikong count, but watch the palm oil, which is where most of the calories hide. Steamed, boiled, roasted or stir-fried in a measured teaspoon of oil are all fine.

Fruit is not the enemy. Bananas, oranges, pawpaw, watermelon, pineapple, apples and berries are all included in your plan. Whole fruit is better than juice because the fibre slows the sugar and fills you up. Dried fruit is easy to overeat, so weigh it.`,
  },
  {
    slug: 'fibre',
    title: 'Fibre',
    body: `Fibre keeps digestion regular, steadies energy after meals and helps you feel full. Aim for **25 to 35 g a day**. Most people get half that, so the step up should be gradual over two to three weeks to avoid bloating.

The easiest sources are already in your plan: beans and lentils, oats, brown rice, whole wheat bread, unripe plantain, sweet potato with the skin, vegetables and fruit with the skin on, groundnuts and seeds. Swapping white bread for whole wheat and adding a serving of beans or vegetables to lunch usually covers the gap.

Drink more water as fibre goes up, because fibre pulls water into the gut. If a particular food leaves you uncomfortable, say so at your check-in and your coach will substitute it rather than you quietly dropping it.`,
  },
  {
    slug: 'cooking-oils',
    title: 'Cooking oils',
    body: `Oil is the quietest source of extra calories in most kitchens. One tablespoon is about 120 kcal, and a free pour when frying stew or plantain can add 400 to 600 kcal without changing how the plate looks.

Your plan assumes **one teaspoon of oil per person per meal for cooking**, measured, and a little more on days where it is written in. Palm oil, groundnut oil, olive oil and coconut oil all carry the same calories, so choose by taste and cooking temperature rather than searching for a low-calorie oil.

Practical swaps: grill, bake, boil or air-fry instead of deep-frying; sauté vegetables in a measured spoon of oil and add a splash of water or stock if the pan dries; skim visible oil from the top of stews and soups before serving; and roast plantain instead of frying it. Mayonnaise and salad cream are oils in disguise, so measure those too.`,
  },
  {
    slug: 'seasoning-and-sauces',
    title: 'Seasoning and sauces',
    body: `Flavour is not the problem; hidden calories are. Dry seasonings such as salt, pepper, curry, thyme, ginger, garlic, suya spice, uziza and crayfish are effectively calorie-free and you can use them freely, within reason for salt.

The sauces to measure are the creamy and sugary ones: mayonnaise, salad cream, ketchup, sweet chilli, barbecue sauce and peanut butter. A tablespoon of mayonnaise is around 90 kcal. Tomato stew counts too, mainly because of the oil used to fry it; a half-cup serving is usually 80 to 150 kcal depending on the recipe.

Better options for volume and flavour include fresh pepper sauce made with little oil, yoghurt-based dressings, lemon juice, vinegar, mustard, hot sauce and salsa. If you cannot enjoy a meal without a particular sauce, keep it, measure it and tell your coach so it is built into the numbers.`,
  },
  {
    slug: 'drinks-and-liquid-calories',
    title: 'Drinks and liquid calories',
    body: `Calories in drinks do not make you full the way food does, so they are the first place to look when progress stalls. A 50 cl bottle of soft drink is about 200 kcal, a bottle of malt drink about 250 kcal, a large glass of fruit juice about 150 kcal, and a bottle of beer about 150 kcal. Zobo, kunu and smoothies vary a lot depending on sugar.

**Water, sparkling water, black tea, black coffee and zero-sugar drinks are free.** Milk in tea or coffee is fine; add it to your log once a day rather than guessing each cup.

Alcohol is covered under social events, but the short version is to budget for it, choose spirits with zero-sugar mixers or a single beer or glass of wine, and drink water alongside. If you want a sweet drink every day, your coach can write it into the plan so it comes from the budget rather than on top of it.`,
  },
  {
    slug: 'eating-out',
    title: 'Eating out',
    body: `Eating out is part of normal life and your plan allows for it. The aim is to make a reasonable choice, not a perfect one.

Before you go, look at the menu if you can and decide what you will order. Build the plate around a **protein first**: grilled fish, chicken, suya, pepper soup, shawarma with extra chicken and less sauce, or a steak. Choose one carbohydrate rather than two (rice or plantain, not both) and ask for sauce or dressing on the side. Swap chips for salad or vegetables where possible.

Portions in restaurants are often double what is on your plan, so it is fine to leave food or take half home. Skip the bread basket and the sugary drinks, and keep alcohol to one.

Log the meal as best you can with an honest estimate. One restaurant meal a week changes very little. Three or four unplanned ones, each 500 kcal over, will cancel the week's deficit.`,
  },
  {
    slug: 'snacks-and-cravings',
    title: 'Snacks and cravings',
    body: `Snacks are written into your plan where they help, usually mid-afternoon or after training. The useful ones are mostly protein or fibre: Greek yoghurt, boiled eggs, a handful of groundnuts or cashews (weighed, around 25 g), fruit, roasted plantain chips in a measured portion, moi moi, tiger nuts, or a protein shake.

Cravings usually mean one of four things: you are thirsty, you are tired, you went too long without eating, or you are bored or stressed. Drink water, wait ten minutes and then decide. If the craving is still there, have a planned portion of the thing you actually want rather than eating around it with three "healthy" alternatives.

If evening cravings are a pattern, say so at your check-in. Moving some carbohydrate from lunch to dinner, or adding a small planned evening snack, usually fixes it. Keep trigger foods out of the house during the week and buy them in single portions when you do.`,
  },
  {
    slug: 'after-a-missed-meal',
    title: 'What to do after a missed meal',
    body: `Missing a meal is not a failure and does not need to be "made up" with a bigger one later. Here is the simple rule: **if the next meal is less than three hours away, just eat the next meal as planned**. If it is longer, have a protein-based snack such as yoghurt, eggs or a shake, then continue with the plan.

Do not combine two meals into one large sitting. Large meals after a long gap tend to be eaten fast, leave you uncomfortable and often lead to extra snacking later. Protein is the one thing worth protecting across the day; if you can only add one item, make it protein.

If you miss meals regularly because of work or travel, tell your coach. The plan can be rebuilt around two larger meals and a snack, or around foods that travel well, so it fits your week instead of fighting it.`,
  },
  {
    slug: 'social-events',
    title: 'Social events',
    body: `Weddings, owambe, birthdays, church and family gatherings are a normal part of life and the plan is designed to survive them. A few habits make the difference.

Eat a protein-rich meal before you go so you arrive comfortable, not hungry. At the event, take one plate, put protein and vegetables on it first and then one carbohydrate, and sit away from the buffet. Enjoy the small chops or cake in a sensible portion rather than pretending you will not. Alternate alcoholic drinks with water and set a limit before you start.

The day after, return to the plan at the next meal. Do not fast, skip meals or add extra training to compensate; that cycle leads to more overeating. Expect the scale to be up by a kilogram or two from salt and water; it will come back down within a few days.

If you have a busy social season, tell your coach and the weekly targets can be set to allow for it.`,
  },
  {
    slug: 'weight-fluctuations',
    title: 'Normal day-to-day weight fluctuations',
    body: `Your bodyweight can move by **one to two kilograms within a single day** and from one day to the next, and almost none of that is body fat. Salt, carbohydrate, water, digestion, bowel habits, training soreness, poor sleep, travel and the menstrual cycle all shift the number.

This is why your plan uses a **weekly average** rather than a single weigh-in. Weigh yourself in the morning after the bathroom, before eating, in similar clothing, three to seven times a week, and record them. The average of the week is the number your coach uses, compared with last week's average.

A single high reading after a salty dinner or a hard leg session means nothing. A weekly average that has not moved for two to three weeks, alongside waist measurements and photos, is information worth acting on, and that is what your check-in is for. Try not to react to the scale yourself; let the trend and your coach decide.`,
  },
  {
    slug: 'food-substitutions',
    title: 'Food substitutions',
    body: `You do not need to eat the exact foods on your plan every day. Swap within the same group and keep the quantity similar, and the numbers stay close enough.

**Carbohydrates** (swap gram for gram, cooked): white rice, jollof or fried rice (slightly higher calories), ofada rice, yam, sweet potato, Irish potato, plantain, pasta, couscous, bread (one slice is about 30 g cooked rice equivalent), eba, amala, pounded yam, semovita, oats. Swallows are dense, so keep the portion to the written weight.

**Proteins** (swap gram for gram, raw): chicken, turkey, lean beef, goat meat, tilapia, mackerel, titus, sardines, prawns, eggs (two eggs ≈ 100 g chicken), Greek yoghurt, tofu, beans or moi moi (count half as carbohydrate).

**Fats**: a teaspoon of any oil, 10 g of groundnuts, a quarter of an avocado, a teaspoon of peanut butter.

**Vegetables and fruit**: swap freely within each group.

If a swap is not obvious, log what you ate and ask at your check-in.`,
  },
];
