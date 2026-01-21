// Vocabulary Data
const vocabData = {
    "PU1": {
        "Unit 1": {
            "Session 1": ["red", "blue", "yellow", "green", "orange", "purple", "pink", "grey", "black", "white", "brown", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "classroom", "rubber", "pencil", "teacher", "bag", "crayon", "desk", "chair", "book", "pen", "pencil case"],
            "全单元单词": ["red", "blue", "yellow", "green", "orange", "purple", "pink", "grey", "black", "white", "brown", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "classroom", "rubber", "pencil", "teacher", "bag", "crayon", "desk", "chair", "book", "pen", "pencil case", "in", "on", "under", "next to", "door", "wall", "window", "board", "cupboard", "bookcase", "paper", "ruler", "playground"]
        },
        "Unit 2": {
            "Session 1": ["family", "grandfather", "grandpa", "grandmother", "grandma", "father", "dad", "mother", "mum", "brother", "sister"],
            "全单元单词": ["family", "grandfather", "grandpa", "grandmother", "grandma", "father", "dad", "mother", "mum", "brother", "sister", "he", "she", "my", "body", "tail", "head", "hair", "nose", "ear", "eye", "mouth", "face", "arm", "hand", "leg", "foot", "feet"]
        },
        "Unit 3": {
            "Session 1": ["cow", "donkey", "horse", "spider", "goat", "cat", "dog", "sheep", "chicken", "duck"],
            "全单元单词": ["cow", "donkey", "horse", "spider", "goat", "cat", "dog", "sheep", "chicken", "duck", "big", "small", "old", "young", "long", "short", "nice", "naughty", "funny", "ugly", "sad", "angry", "happy", "beautiful", "different"]
        },
        "Unit 4": {
            "Session 1": ["cake", "chicken", "burger", "chocolate", "bread", "lemonade", "water", "banana", "mango", "salad"],
            "全单元单词": ["cake", "chicken", "burger", "chocolate", "bread", "lemonade", "water", "banana", "mango", "salad", "fruit", "apple", "grapes", "oranges", "juice", "meat", "meatball", "beans", "sausage"]
        },
        "Unit 5": {
            "Session 1": ["plane", "kite", "doll", "ball", "robot", "house", "car", "bike", "toys"],
            "全单元单词": ["toys", "plane", "kite", "doll", "ball", "robot", "house", "car", "bike", "helicopter", "teddy bear", "radio", "toy box", "balloon", "computer", "keyboard", "board game", "ship", "mouse"]
        },
        "Unit 6": {
            "Session 1": ["tree", "train", "bus stop", "bus", "garden", "shop", "motorbike", "car", "lorry", "park", "flower"],
            "全单元单词": ["tree", "train", "bus stop", "bus", "garden", "shop", "motorbike", "car", "lorry", "park", "flower", "zoo", "hippo", "giraffe", "polar bear", "bear", "elephant", "zebra", "crocodile", "lizard", "monkey", "snake", "tiger"]
        },
        "Unit 7": {
            "Session 1": ["play", "tennis", "football", "basketball", "guitar", "piano", "bike", "swim", "watch", "television"],
            "全单元单词": ["play", "tennis", "football", "basketball", "guitar", "piano", "bike", "swim", "watch", "television", "throw", "throwing", "catch", "catching", "hit", "hitting", "run", "running", "kick", "kicking", "ride", "riding", "playing", "watching", "badminton", "baseball", "hockey"]
        },
        "Unit 8": {
            "Session 1": ["bed", "radio", "bedroom", "bath", "mirror", "bathroom", "kitchen", "dining room", "living room"],
            "全单元单词": ["bed", "radio", "bedroom", "bath", "mirror", "bathroom", "kitchen", "dining room", "living room", "clock", "painting", "hall", "rug", "phone", "floor", "sofa", "lamp", "armchair", "behind", "between", "in front of"]
        },
        "Unit 9": {
            "Session 1": ["trousers", "hat", "sunglasses", "shirt", "dress", "cap", "shorts", "T-shirt", "skirt", "shoes", "jacket", "jeans", "boots"],
            "全单元单词": ["trousers", "hat", "sunglasses", "shirt", "dress", "cap", "shorts", "T-shirt", "skirt", "shoes", "jacket", "jeans", "boots", "fish", "fishing", "jellyfish", "sea", "boat", "beach", "camera", "sand", "shell", "sun", "take", "taking", "photos"]
        }
    },
    "PU2": {
        "Unit 1": {
            "Session 1": ["mountain", "lake", "river", "forest", "ground", "grass", "leaves", "leaf", "field", "tractor", "rock"],
            "全单元单词": ["mountain", "lake", "river", "forest", "ground", "grass", "leaves", "leaf", "field", "tractor", "rock", "kitten", "young", "dirty", "clean", "puppy", "naughty", "Wake up", "get up", "have a shower", "towel", "get dressed", "toothpaste", "toothbrush", "have breakfast"]
        },
        "Unit 2": {
            "Session 1": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "week", "weekend"],
            "全单元单词": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "week", "weekend", "Listen to music", "write an email", "go skating", "read a comic", "go shopping", "watch films", "listen to a CD", "watch a DVD", "often", "never", "sometimes", "always"]
        },
        "Unit 3": {
            "Session 1": ["clown", "film star", "pop star", "treasure", "pirate", "cook", "nurse", "dentist", "present", "doctor", "farmer", "costume", "party", "surprise"],
            "全单元单词": ["clown", "film star", "pop star", "treasure", "pirate", "cook", "nurse", "dentist", "present", "doctor", "farmer", "costume", "party", "surprise", "thin", "tall", "straight", "blonde", "short", "fat", "beard", "moustache", "fair", "curly"]
        },
        "Unit 4": {
            "Session 1": ["aunt", "cousin", "daughter", "granddaughter", "grandparents", "grandson", "grandchildren", "grown-up", "parents", "son", "uncle"],
            "全单元单词": ["aunt", "cousin", "daughter", "granddaughter", "grandparents", "grandson", "grandchildren", "grown-up", "parents", "son", "uncle", "basement", "balcony", "lift", "roof", "stairs", "upstairs", "downstairs", "inside", "outside", "floor", "first", "second", "third", "fourth"]
        },
        "Unit 5": {
            "Session 1": ["bat", "bear", "cage", "dolphin", "kangaroo", "lion", "panda", "parrot", "penguin", "rabbit", "whale"],
            "全单元单词": ["bat", "bear", "cage", "dolphin", "kangaroo", "lion", "panda", "parrot", "penguin", "rabbit", "whale", "young", "youngest", "fat", "fattest", "long", "longest", "big", "biggest", "tall", "tallest", "thin", "thinnest", "short", "shortest", "bad", "worst", "clever", "cleverest", "good", "best", "funny", "funniest", "curly", "curliest", "pretty", "prettiest", "old", "oldest", "dirty", "dirtiest", "happy", "happiest", "climb", "fall", "fly", "hide", "jump", "lose", "move", "run", "walk", "snail", "sky", "slow", "slowest", "fast", "fastest", "above", "below", "near", "opposite"]
        },
        "Unit 6": {
            "Session 1": ["cloud", "cold", "hot", "rain", "rainbow", "snow", "sunny", "wind", "weather", "cloudy", "windy", "raining", "snowing"],
            "全单元单词": ["Cloud", "cold", "hot", "rain", "rainbow", "snow", "sunny", "wind", "weather", "cloudy", "windy", "raining", "snowing", "boots", "coat", "scarf", "shorts", "sweater", "T-shirt", "take off", "put on", "wear", "wearing"]
        },
        "Unit 7": {
            "Session 1": ["soup", "cup", "vegetables", "plate", "pasta", "bottle", "glass", "sandwich", "cheese", "bowl", "salad"],
            "全单元单词": ["soup", "cup", "vegetables", "plate", "pasta", "bottle", "glass", "sandwich", "cheese", "bowl", "salad", "cook", "wash", "carry", "drop", "fry", "cry", "cut", "wear", "boil"]
        },
        "Unit 8": {
            "Session 1": ["ride", "map", "funfair", "city centre", "road", "station", "ticket", "car park"],
            "全单元单词": ["ride", "map", "funfair", "city centre", "road", "station", "ticket", "car park", "cafe", "square", "cinema", "library", "hospital", "shopping centre", "supermarket", "sports centre", "swimming pool", "market", "bus station"]
        },
        "Unit 9": {
            "Session 1": ["surprised", "frightened", "dangerous", "difficult", "easy", "hungry", "exciting", "afraid", "tired", "thirsty", "circus"],
            "全单元单词": ["Travel", "text", "World", "tour", "email", "adventure", "busy", "round", "around", "apartment", "world"]
        }
    },
    "PU3": {
        "Unit 1": {
            "全单元单词": ["midday", "midnight", "o'clock", "half past", "jump", "catch", "dance", "shout", "laugh", "dress up", "hop", "skip", "climb"]
        },
        "Unit 2": {
            "Session 1": ["tea", "cup", "coffee", "milkshake", "glass", "noodles", "yoghurt", "sauce", "cereal", "pancake", "strawberries"],
            "全单元单词": ["tea", "cup", "coffee", "milkshake", "glass", "noodles", "yoghurt", "sauce", "cereal", "pancake", "strawberries", "had", "gave", "saw", "told", "grew up", "built", "drove", "took", "wrote", "taught", "got dressed up"]
        },
        "Unit 3": {
            "全单元单词": ["shoulder", "neck", "finger", "stomach", "bandage", "knee", "toe", "elbow", "back", "cough", "temperature", "sore throat", "cold", "backache", "stomach-ache", "arm", "leg", "hand", "foot", "feet", "teeth", "tooth", "ill", "sick", "problem"]
        },
        "Unit 5": {
            "Session 1": ["gold", "silver", "wing", "bright", "light", "spotted", "spots", "striped", "stripes", "plain", "trousers"],
            "Session 2": ["gold", "silver", "wing", "bright", "light", "spotted", "spots", "striped", "stripes", "plain", "paper", "made of", "trousers", "shirt", "T-shirt", "jacket", "costume", "shoes", "rubber", "wearing"],
            "Session 3": ["gold", "silver", "wing", "bright", "light", "spotted", "spots", "striped", "stripes", "plain", "paper", "made of", "trousers", "shirt", "T-shirt", "jacket", "costume", "shoes", "rubber", "wearing", "metal", "paper", "wood", "wool", "card", "glass", "plastic"]
        }
    }
};

window.vocabData = vocabData;
