// City data from user's provided Sri Lankan districts
export const cities = [
    // Matara District
    "Akuressa", "Alapaladeniya", "Aparekka", "Athuraliya", "Bengamuwa", "Beralapanathara", "Bopagoda", "Dampahala", "Deegala Lenama", "Deiyandara", "Dellawa", "Denagama", "Denipitiya", "Deniyaya", "Derangala", "Dikwella", "Diyagaha", "Diyalape", "Gandara", "Godapitiya", "Gomilamawarala", "Hakmana", "Handugala", "Horapawita", "Kalubowitiyana", "Kamburugamuwa", "Kamburupitiya", "Karagoda Uyangoda", "Karaputugala", "Karatota", "Kekanadurra", "Kiriweldola", "Kiriwelkele", "Kolawenigama", "Kotapola", "Kottegoda", "Lankagama", "Makandura", "Maliduwa", "Maramba", "Matara", "Mediripitiya", "Miella", "Mirissa", "Moragala Kirillapone", "Morawaka", "Mulatiyana Junction", "Nadugala", "Naimana", "Narawelpita", "Pahala Millawa", "Palatuwa", "Paragala", "Parapamulla", "Pasgoda", "Penetiyana", "Pitabeddara", "Pothdeniya", "Puhulwella", "Radawela", "Ransegoda", "Ratmale", "Rotumba", "Siyambalagoda", "Sultanagoda", "Telijjawila", "Thihagoda", "Urubokka", "Urugamuwa", "Urumutta", "Viharahena", "Walakanda", "Walasgala", "Waralla", "Weligama", "Wilpita", "Yatiyana",

    // Kurunegala District
    "Alahengama", "Alahitiyawa", "Alawatuwala", "Alawwa", "Ambakote", "Ambanpola", "Anhandiya", "Anukkane", "Aragoda", "Ataragalla", "Awulegama", "Balalla", "Bamunukotuwa", "Bandara Koswatta", "Bingiriya", "Bogamulla", "Bopitiya", "Boraluwewa", "Boyagane", "Bujjomuwa", "Buluwala", "Dambadeniya", "Daraluwa", "Deegalla", "Delwite", "Demataluwa", "Diddeniya", "Digannewa", "Divullegoda", "Dodangaslanda", "Doratiyawa", "Dummalasuriya", "Ehetuwewa", "Elibichchiya", "Embogama", "Etungahakotuwa", "Galgamuwa", "Gallewa", "Girathalana", "Giriulla", "Gokaralla", "Gonawila", "Halmillawewa", "Hengamuwa", "Hettipola", "Hilogama", "Hindagolla", "Hiriyala Lenawa", "Hiruwalpola", "Horambawa", "Hulogedara", "Hulugalla", "Hunupola", "Ihala Gomugomuwa", "Ihala Katugampala", "Indulgodakanda", "Inguruwatta", "Iriyagolla", "Ithanawatta", "Kadigawa", "Kahapathwala", "Kalugamuwa", "Kanadeniyawala", "Kanattewewa", "Karagahagedara", "Karambe", "Katupota", "Kekunagolla", "Keppitiwalana", "Kimbulwanaoya", "Kirimetiyawa", "Kirindawa", "Kirindigalla", "Kithalawa", "Kobeigane", "Kohilagedara", "Konwewa", "Kosdeniya", "Kosgolla", "Kotawehera", "Kudagalgamuwa", "Kudakatnoruwa", "Kuliyapitiya", "Kumbukgeta", "Kumbukwewa", "Kuratihena", "Kurunegala", "Labbala", "lbbagamuwa", "lhala Kadigamuwa", "llukhena", "Lonahettiya", "Madahapola", "Madakumburumulla", "Maduragoda", "Maeliya", "Magulagama", "Mahagalkadawala", "Mahagirilla", "Mahamukalanyaya", "Mahananneriya", "Maharachchimulla", "Maho", "Makulewa", "Makulpotha", "Makulwewa", "Malagane", "Mandapola", "Maspotha", "Mawathagama", "Medivawa", "Meegalawa", "Meetanwala", "Meewellawa", "Melsiripura", "Metikumbura", "Metiyagane", "Minhettiya", "Minuwangete", "Mirihanagama", "Monnekulama", "Moragane", "Moragollagama", "Morathiha", "Munamaldeniya", "Muruthenge", "Nabadewa", "Nagollagama", "Nagollagoda", "Nakkawatta", "Narammala", "Narangoda", "Nawatalwatta", "Nelliya", "Nikadalupotha", "Nikaweratiya", "Padeniya", "Padiwela", "Pahalagiribawa", "Pahamune", "Palukadawala", "Panadaragama", "Panagamuwa", "Panaliya", "Panliyadda", "Pannala", "Pansiyagama", "Periyakadneluwa", "Pihimbiya Ratmale", "Pihimbuwa", "Pilessa", "Polgahawela", "Polpitigama", "Pothuhera", "Puswelitenna", "Ridibendiella", "Ridigama", "Saliya Asokapura", "Sandalankawa", "Sirisetagama", "Siyambalangamuwa", "Solepura", "Solewewa", "Sunandapura", "Talawattegedara", "Tambutta", "Thalahitimulla", "Thalakolawewa", "Thalwita", "Thambagalla", "Tharana Udawela", "Thimbiriyawa", "Tisogama", "Torayaya", "Tuttiripitigama", "Udubaddawa", "Uhumiya", "Ulpotha Pallekele", "Usgala Siyabmalangamuwa", "Wadakada", "Wadumunnegedara", "Walakumburumulla", "Wannigama", "Wannikudawewa", "Wannilhalagama", "Wannirasnayakapura", "Warawewa", "Wariyapola", "Watuwatta", "Weerapokuna", "Welawa Juncton", "Welipennagahamulla", "Wellagala", "Wellarawa", "Wellawa", "Welpalla", "Wennoruwa", "Weuda", "Wewagama", "Yakwila", "Yatigaloluwa",

    // Kandy District
    "Akurana", "Alawatugoda", "Aludeniya", "Ambagahapelessa", "Ambatenna", "Ampitiya", "Ankumbura", "Atabage", "Balana", "Bambaragahaela", "Barawardhana Oya", "Batagolladeniya", "Batugoda", "Batumulla", "Bawlana", "Bopana", "Danture", "Dedunupitiya", "Dekinda", "Deltota", "Dolapihilla", "Dolosbage", "Doluwa", "Doragamuwa", "Dunuwila", "Ekiriya", "Elamulla", "Etulgama", "Galaboda", "Galagedara", "Galaha", "Galhinna", "Gallellagama", "Gampola", "Gelioya", "Godamunna", "Gomagoda", "Gonagantenna", "Gonawalapatana", "Gunnepana", "Gurudeniya", "Halloluwa", "Handaganawa", "Handawalapitiya", "Handessa", "Hanguranketha", "Harankahawa", "Hasalaka", "Hataraliyadda", "Hewaheta", "Hindagala", "Hondiyadeniya", "Hunnasgiriya", "Jambugahapitiya", "Kadugannawa", "Kahataliyadda", "Kalugala", "Kandy", "Kapuliyadde", "Karandagolla", "Katugastota", "Kengalla", "Ketakumbura", "Ketawala Leula", "Kiribathkumbura", "Kobonila", "Kolabissa", "Kolongoda", "Kulugammana", "Kumbukkandura", "Kumburegama", "Kundasale", "Leemagahakotuwa", "lhala Kobbekaduwa", "lllagolla", "Lunuketiya Maditta", "Madawala Bazaar", "Madugalla", "Madulkele", "Mahadoraliyadda", "Mahamedagama", "Mailapitiya", "Makkanigama", "Makuldeniya", "Mandaram Nuwara", "Mapakanda", "Marassana", "Marymount Colony", "Maturata", "Mawatura", "Medamahanuwara", "Medawala Harispattuwa", "Meetalawa", "Megoda Kalugamuwa", "Menikdiwela", "Menikhinna", "Mimure", "Minigamuwa", "Minipe", "Murutalawa", "Muruthagahamulla", "Naranpanawa", "Nattarampotha", "Nawalapitiya", "Nillambe", "Nugaliyadda", "Nugawela", "Pallebowala", "Pallekotuwa", "Panvila", "Panwilatenna", "Paradeka", "Pasbage", "Pattitalawa", "Pattiya Watta", "Penideniya", "Peradeniya", "Pilawala", "Pilimatalawa", "Poholiyadda", "Polgolla", "Pujapitiya", "Pupuressa", "Pussellawa", "Putuhapuwa", "Rajawella", "Rambukpitiya", "Rambukwella", "Rangala", "Rantembe", "Rathukohodigala", "Rikillagaskada", "Sangarajapura", "Senarathwela", "Talatuoya", "Tawalantenna", "Teldeniya", "Tennekumbura", "Uda Peradeniya", "Udahentenna", "Udahingulwala", "Udatalawinna", "Udawatta", "Udispattuwa", "Ududumbara", "Uduwa", "Uduwahinna", "Uduwela", "Ulapane", "Ulpothagama", "Unuwinna", "Velamboda", "Watagoda Harispattuwa", "Wattappola", "Wattegama", "Weligalla", "Weligampola", "Wendaruwa", "Weragantota", "Werapitya", "Werellagama", "Wettawa", "Wilanagama", "Yahalatenna", "Yatihalagala",

    // Kalutara District
    "Agalawatta", "Alubomulla", "Alutgama", "Anguruwatota", "Baduraliya", "Bandaragama", "Bellana", "Beruwala", "Bolossagama", "Bombuwala", "Boralugoda", "Bulathsinhala", "Danawala Thiniyawala", "Delmella", "Dharga Town", "Diwalakada", "Dodangoda", "Dombagoda", "Galpatha", "Gamagoda", "Gonapola Junction", "Govinna", "Gurulubadda", "Halkandawila", "Haltota", "Halwala", "Halwatura", "Hedigalla Colony", "Horana", "Ittapana", "Kalawila Kiranthidiya", "Kalutara", "Kananwila", "Kandanagama", "Kehelwatta", "Kelinkanda", "Kitulgoda", "Koholana", "Kuda Uduwa", "lngiriya", "Maggona", "Mahagama", "Mahakalupahana", "Matugama", "Meegahatenna", "Meegama", "Millaniya", "Millewa", "Miwanapalana", "Molkawa", "Morapitiya", "Morontuduwa", "Nawattuduwa", "Neboda", "Padagoda", "Pahalahewessa", "Paiyagala", "Panadura", "Pannila", "Paragastota", "Paragoda", "Paraigama", "Pelanda", "Pelawatta", "Pokunuwita", "Polgampola", "Poruwedanda", "Remunagoda", "Tebuwana", "Uduwara", "Utumgama", "Veyangalla", "Wadduwa", "Walagedara", "Walallawita", "Waskaduwa", "Welipenna", "Welmilla Junction", "Yagirala", "Yatadolawatta", "Yatawara Junction",

    // Gampaha District
    "Akaragama", "Alawala", "Ambagaspitiya", "Ambepussa", "Andiambalama", "Attanagalla", "Badalgama", "Banduragoda", "Batuwatta", "Bemmulla", "Biyagama", "Biyagama IPZ", "Bokalagama", "Bopagama", "Buthpitiya", "Dagonna", "Danowita", "Debahera", "Dekatana", "Delgoda", "Delwagura", "Demalagama", "Demanhandiya", "Dewalapola", "Divulapitiya", "Divuldeniya", "Dompe", "Dunagaha", "Ekala", "Ellakkala", "Essella", "Gampaha", "Ganemulla", "GonawalaWP", "Heiyanthuduwa", "Hendala", "Henegama", "Hinatiyana Madawala", "Hiswella", "Horampella", "Hunumulla", "Ihala Madampella", "Imbulgoda", "Ja-Ela", "Kadawatha", "Kahatowita", "Kalagedihena", "Kaleliya", "Kaluaggala", "Kandana", "Kapugoda", "Kapuwatta", "Katana", "Katunayake", "Katunayake Air Force Camp", "Katuwellegama", "Kelaniya", "Kimbulapitiya", "Kiribathgoda", "Kirindiwela", "Kitalawalana", "Kitulwala", "Kochchikade", "Kotadeniyawa", "Kotugoda", "Kumbaloluwa", "Loluwagoda", "Lunugama", "Mabodale", "Madelgamuwa", "Makewita", "Makola", "Malwana", "Mandawala", "Marandagahamula", "Mellawagedara", "Minuwangoda", "Mirigama", "Mithirigala", "Muddaragama", "Mudungoda", "Naranwala", "Nawana", "Nedungamuwa", "Negombo", "Nikahetikanda", "Nittambuwa", "Niwandama", "Pallewela", "Pamunugama", "Pamunuwatta", "Pasyala", "Peliyagoda", "Pepiliyawala", "Pethiyagoda", "Polpithimukulana", "Pugoda", "Radawadunna", "Radawana", "Raddolugama", "Ragama", "Ruggahawila", "Rukmale", "Seeduwa", "Siyambalape", "Talahena", "Thimbirigaskatuwa", "Tittapattara", "Udathuthiripitiya", "Udugampola", "Uggalboda", "Urapola", "Uswetakeiyawa", "Veyangoda", "Walgammulla", "Walpita", "Wanaluwewa", "Wathurugama", "Watinapaha", "Wattala", "Weboda", "Wegowwa", "Weliveriya", "Weweldeniya", "Yakkala",

    // Colombo District
    "Colombo 01", "Colombo 02", "Colombo 03", "Colombo 04", "Colombo 05", "Colombo 06", "Colombo 07", "Colombo 08", "Colombo 09", "Colombo 10", "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15", "Akarawita", "Angoda", "Arangala", "Athurugiriya", "Avissawella", "Bambalapitiya", "Batawala", "Battaramulla", "Batugampola", "Bope", "Boralesgamuwa", "Borella", "Dedigamuwa", "Dehiwala", "Deltara", "Embuldeniya", "Gongodawila", "Habarakada", "Handapangoda", "Hanwella", "Hewainna", "Hiripitya", "Hokandara", "Homagama", "Horagala", "Kaduwela", "Kahawala", "Kalatuwawa", "Kalubowila", "Kiriwattuduwa", "Kohuwala", "Kolonnawa", "Kosgama", "Kotahena", "Kotikawatta", "Kottawa", "Madapatha", "Maharagama", "Malabe", "Meegoda", "Moratuwa", "Mount Lavinia", "Mullegama", "Mulleriyawa", "Mutwal", "Napawela", "Narahenpita", "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala", "Pita Kotte", "Pitipana Homagama", "Polgasowita", "Puwakpitiya", "Rajagiriya", "Ranala", "Ratmalana", "Siddamulla", "Sri Jayewardenepura", "Talawatugoda", "Tummodara", "Waga", "Watareka", "Wijerama",

    // Galle District
    "Agaliya", "Ahangama", "Ahungalla", "Akmeemana", "Aluthwala", "Ambalangoda", "Ampegama", "Amugoda", "Anangoda", "Angulugaha", "Ankokkawala", "Baddegama", "Balapitiya", "Banagala", "Batapola", "Bentota", "Boossa", "Dikkumbura", "Dodanduwa", "Ella", "Tanabaddegama", "Elpitiya", "Ethkandura", "Galle", "Ganegoda", "Ginimellagaha", "Gintota", "Godahena", "Gonagalpura", "Gonamulla Junction", "Gonapinuwala", "Habaraduwa", "Haburugala", "Halvitigala Colony", "Hawpe", "Hikkaduwa", "Hiniduma", "Hiyare", "Ihala", "Walpola", "Kahaduwa", "Kahawa", "Kananke Bazaar", "Karagoda", "Karandeniya", "Kosgoda", "Kottawagama", "Kuleegoda", "lhalahewessa", "lmaduwa", "lnduruwa", "Magedara", "Malgalla Talangalla", "Mapalagama", "Mapalagama Central", "Mattaka", "Meda-Keembiya", "Meetiyagoda", "Miriswatta", "Nagoda", "Nakiyadeniya", "Nawadagala", "Neluwa", "Nindana", "Opatha", "Panangala", "Pannimulla Panagoda", "Parana ThanaYamgoda", "Pitigala", "Poddala", "Porawagama", "Rantotuwila", "Ratgama", "Talagampola", "Talgaspe", "Talgaswela", "Talpe", "Tawalama", "Tiranagama", "Udalamatta", "Udugama", "Uluvitike", "Unawatuna", "Unenwitiya", "Uragaha", "Uragasmanhandiya", "Wakwella", "Walahanduwa", "Wanchawela", "Wanduramba", "Warukandeniya", "Watugedara", "Weihena", "Yakkalamulla", "Yatalamatta",

    // Anuradhapura District
    "Andiyagala", "Angamuwa", "Anuradhapura", "Awukana", "Bogahawewa", "Dematawewa", "Dunumadalawa", "Dutuwewa", "Elayapattuwa", "Eppawala", "Etawatunuwewa", "Etaweeragollewa", "Galadivulwewa", "Galenbindunuwewa", "Galkadawala", "Galkiriyagama", "Galkulama", "Galnewa", "Gambirigaswewa", "Ganewalpola", "Gemunupura", "Getalawa", "Gnanikulama", "Gonahaddenawa", "Habarana", "Halmillawa Dambulla", "Halmillawetiya", "Hidogama", "Horawpatana", "Horiwila", "Hurigaswewa", "Hurulunikawewa", "Kagama", "Kahatagasdigiliya", "Kahatagollewa", "Kalakarambewa", "Kalankuttiya", "Kalaoya", "Kalawedi Ulpotha", "Kallanchiya", "Kapugallawa", "Karagahawewa", "Katiyawa", "Kebithigollewa", "Kekirawa", "Kendewa", "Kiralogama", "Kirigalwewa", "Kitulhitiyawa", "Kurundankulama", "Labunoruwa", "lhala Halmillewa", "lhalagama", "lpologama", "Madatugama", "Maha Elagamuwa", "Mahabulankulama", "Mahailluppallama", "Mahakanadarawa", "Mahapothana", "Mahasenpura", "Mahawilachchiya", "Mailagaswewa", "Malwanagama", "Maneruwa", "Maradankadawala", "Maradankalla", "Medawachchiya", "Megodawewa", "Mihintale", "Morakewa", "Mulkiriyawa", "Muriyakadawala", "Nachchaduwa", "Namalpura", "Negampaha", "Nochchiyagama", "Padavi Maithripura", "Padavi Parakramapura", "Padavi Sripura", "Padavi Sritissapura", "Padaviya", "Padikaramaduwa", "Pahala Halmillewa", "Pahala Maragahawe", "Pahalagama", "Palagala", "Palugaswewa", "Pandukabayapura", "Pandulagama", "Parakumpura", "Parangiyawadiya", "Parasangahawewa", "Pemaduwa", "Perimiyankulama", "Pihimbiyagolewa", "Pubbogama", "Pulmoddai", "Punewa", "Rajanganaya", "Rambewa", "Rampathwila", "Ranorawa", "Rathmalgahawewa", "Saliyapura", "Seeppukulama", "Senapura", "Sivalakulama", "Siyambalewa", "Sravasthipura", "Talawa", "Tambuttegama", "Tammennawa", "Tantirimale", "Telhiriyawa", "Tennamarawadiya", "Tirappane", "Tittagonewa", "Udunuwara Colony", "Upuldeniya", "Uttimaduwa", "Viharapalugama", "Vijithapura", "Wahalkada", "Wahamalgollewa", "Walagambahuwa", "Walahaviddawewa", "Welimuwapotana", "Welioya Project",


    // India
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Kochi",
    "Thiruvananthapuram",
    "Coimbatore",
    "Madurai",
    "Mysore",
    "Indore",
    "Bhopal",
    "Vadodara",
    "Nagpur",
    "Surat",

    // UAE
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",

    // Qatar
    "Doha",
    "Al Rayyan",
    "Al Wakrah",
    "Al Khor",
    "Mesaieed",
    "Dukhan",

    // Saudi Arabia
    "Riyadh",
    "Jeddah",
    "Mecca",
    "Medina",
    "Dammam",
    "Khobar",
    "Tabuk",
    "Abha",
    "Hail",
    "Jubail",

    // Singapore
    "Singapore",

    // UK
    "London",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Liverpool",
    "Sheffield",
    "Bristol",
    "Glasgow",
    "Edinburgh",
    "Newcastle",
    "Leicester",
    "Nottingham",
    "Cardiff",
    "Belfast",

    // USA
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington",
    "Boston",
    "Nashville",
    "Baltimore",
    "Louisville",
    "Portland",
    "Oklahoma City",
    "Milwaukee",
    "Las Vegas",
    "Albuquerque",
    "Tucson",
    "Fresno",
    "Sacramento",
    "Kansas City",
    "Mesa",
    "Atlanta",
    "Colorado Springs",
    "Raleigh",
    "Omaha",
    "Miami",
    "Oakland",
    "Tulsa",
    "Minneapolis",
    "Cleveland",
    "Wichita",
    "Arlington",

    // Australia
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Canberra",
    "Newcastle",
    "Wollongong",
    "Logan City",
    "Geelong",
    "Hobart",
    "Townsville",
    "Cairns",
    "Darwin",

    // Canada
    "Toronto",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Kitchener",
    "London",
    "Halifax",
    "Victoria",
    "Windsor",
    "Oshawa",
    "Saskatoon",
    "Regina",
    "St. John's",
    "Kelowna",
    "Barrie",
];

// Function to get cities by country (optional - for filtering)
export const getCitiesByCountry = (country: string): string[] => {
    const countryToCities: Record<string, string[]> = {
        "Sri Lanka": cities.slice(0, 850),
        "India": cities.slice(850, 870),
        "United Arab Emirates": cities.slice(870, 878),
        "Qatar": cities.slice(878, 884),
        "Saudi Arabia": cities.slice(884, 894),
        "Singapore": cities.slice(894, 895),
        "United Kingdom": cities.slice(895, 909),
        "United States": cities.slice(909, 959),
        "Australia": cities.slice(959, 974),
        "Canada": cities.slice(974, 994),
    };

    return countryToCities[country] || cities;
};
