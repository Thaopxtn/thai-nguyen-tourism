/**
 * Thai Nguyen Tourism - Professional UI/UX Application Engine
 * Developed according to UI/UX Pro Max Guidelines (Inspired by Airbnb & Lonely Planet)
 * Clean hierarchy, Lucide SVG icons, zero clutter, accessible & responsive.
 */

// --- GLOBAL APPLICATION STATE ---
const state = {
  lang: localStorage.getItem('tn_lang') || 'vi',
  activeFilter: 'all',
  activeSeason: 'spring',
  activeEpoch: 6, // 0-indexed, default to Epoch 7 (New Thai Nguyen 2025)
  savedPlaces: JSON.parse(localStorage.getItem('tn_saved_places') || '[]'),
  soundPlaying: false,
  audioCtx: null,
  ambientNode: null,
  chimeInterval: null
};

// --- REAL-WORLD VERIFIED DESTINATIONS ---
const DESTINATIONS = [
  {
    id: 'babe-lake',
    category: 'lake',
    nameEn: 'Ba Be Lake',
    nameVi: 'Hồ Ba Bể',
    tagEn: 'Ramsar Wetland Site',
    tagVi: 'Khu Ramsar Thế Giới',
    districtEn: 'Ba Be National Park',
    districtVi: 'Vườn Quốc gia Ba Bể',
    image: 'assets/images/babe-lake.jpg',
    featured: true,
    descEn: 'One of the world\'s 20 special freshwater karst lakes, Ba Be unites three basins: Pé Lèng, Pé Lù, and Pé Làm. Sheltered by 1,000-meter limestone karsts and primeval rainforests, visitors glide on traditional dugouts over jade-green waters.',
    descVi: 'Một trong 20 hồ nước ngọt karst tự nhiên đặc biệt của thế giới cần được bảo vệ, Ba Bể hợp lưu từ 3 phân hồ: Pé Lèng, Pé Lù và Pé Làm. Được bao bọc bởi vách núi đá vôi ngàn mét và rừng nguyên sinh, mặt nước biếc phản chiếu mây trời quanh năm.',
    highlightsEn: ['Scenic boat cruise on calm waters', 'Pac Ngoi traditional Tay stilt village', 'Widow Island & An Ma temple'],
    highlightsVi: ['Du thuyền lướt sóng ngắm non nước', 'Bản nhà sàn Pác Ngòi mộc mạc', 'Gò Bà Góa & Đền An Mạ linh thiêng'],
    idealSeasonEn: 'May – November',
    idealSeasonVi: 'Tháng 5 – 11',
  },
  {
    id: 'tan-cuong-tea-hills',
    category: 'tea',
    nameEn: 'Tan Cuong Tea Terraces',
    nameVi: 'Đồi Chè Tân Cương',
    tagEn: 'Tea Capital of Vietnam',
    tagVi: 'Đệ Nhất Danh Trà',
    districtEn: 'Thai Nguyen City',
    districtVi: 'TP. Thái Nguyên',
    image: 'assets/images/tan-cuong-tea.jpg',
    featured: true,
    descEn: 'The iconic rolling green hills of Tan Cuong stretch endlessly across gentle slopes. Renowned nationwide for producing prized green tea with a sweet floral aroma, bright amber liquor, and a lingering honeyed aftertaste.',
    descVi: 'Những nương chè mâm xôi, bát úp uốn lượn xanh mướt ngút ngàn. Nơi các nghệ nhân thu hái búp chè một tôm hai lá và sao chè thủ công trên chảo gang, tạo nên tách trà đượm hương cốm non và vị ngọt hậu sâu lắng.',
    highlightsEn: ['Iconic conical tea hills', 'Artisan pan-roasting workshops', 'Tea appreciation masterclasses'],
    highlightsVi: ['Nương chè bát úp mâm xôi ngút ngàn', 'Nghệ thuật sao suốt thủ công', 'Thưởng trà & nghệ thuật trà đạo'],
    idealSeasonEn: 'Year-round (Best: Spring & Autumn)',
    idealSeasonVi: 'Bốn mùa (Đẹp nhất: Xuân & Thu)',
  },
  {
    id: 'puong-cave',
    category: 'cave',
    nameEn: 'Puong Cave',
    nameVi: 'Động Puông',
    tagEn: 'Subterranean River Tunnel',
    tagVi: 'Hang Sông Ngầm Kỳ Vĩ',
    districtEn: 'Ba Be Region',
    districtVi: 'Khu vực Ba Bể',
    image: 'assets/images/puong-cave.jpg',
    featured: false,
    descEn: 'A colossal 300-meter limestone cavern where the Nang River flows straight through the heart of Lung Nham mountain. Travelers voyage inside by wooden motorboat beneath towering cliffs and thousands of nesting bats.',
    descVi: 'Dòng sông Năng chảy xuyên qua lòng dãy núi đá vôi Lũng Nham tạo thành đường hầm karst tự nhiên dài 300m, vòm cao hơn 30m sừng sững dưới những nhũ đá kỳ dị và đàn dơi tự nhiên trú ngụ.',
    highlightsEn: ['300m subterranean boat voyage', 'Natural limestone stalactites', 'Colony of mountain bats'],
    highlightsVi: ['Du thuyền luồn qua hang núi 300m', 'Vòm thạch nhũ đá vôi đồ sộ', 'Quần thể dơi tự nhiên trên vòm đá'],
    idealSeasonEn: 'Year-round',
    idealSeasonVi: 'Quanh năm',
  },
  {
    id: 'dau-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Dau Dang Waterfall',
    nameVi: 'Thác Đầu Đẳng',
    tagEn: 'Roaring River Rapids',
    tagVi: 'Ghềnh Thác Sông Năng',
    districtEn: 'Ba Be Region',
    districtVi: 'Khu vực Ba Bể',
    image: 'assets/images/dau-dang-waterfall.jpg',
    featured: false,
    descEn: 'Where the Nang River crashes violently against giant limestone boulders, cascading over a 500-meter natural staircase into roaring white foam amidst primeval rainforest canopies.',
    descVi: 'Nơi sông Năng gặp ghềnh đá vôi khổng lồ, đổ dốc qua quãng dài hơn 500m tạo thành dải bọt tuyết trắng xóa giữa rừng đại ngàn hoang sơ. Tiếng thác gầm vang mang lại trải nghiệm đầy phấn khích.',
    highlightsEn: ['500m rushing cascade rapids', 'Primeval jungle walking trails', 'Habitat of rare giant fish'],
    highlightsVi: ['Dãy ghềnh đá dài 500m tung bọt trắng', 'Đường mòn xuyên rừng nguyên sinh', 'Môi trường sống của cá chiên quý hiếm'],
    idealSeasonEn: 'May – October',
    idealSeasonVi: 'Tháng 5 – 10',
  },
  {
    id: 'hua-ma-cave',
    category: 'cave',
    nameEn: 'Hua Ma Cave',
    nameVi: 'Động Hua Mạ',
    tagEn: 'Stalactite Cathedral',
    tagVi: 'Thánh Đường Nhũ Đá',
    districtEn: 'Leo Pen Mountain',
    districtVi: 'Lưng chừng Núi Lèo Pèn',
    image: 'assets/images/hua-ma-cave.jpg',
    featured: false,
    descEn: 'Perched halfway up Leo Pen mountain, Hua Ma reveals a dry chamber stretching 700 meters deep with 50-meter ceilings, packed with thousand-year-old stalactites resembling stone lotus flowers.',
    descVi: 'Tọa lạc ở lưng chừng núi Lèo Pèn, động Hua Mạ mở ra vòm hang khô sâu hơn 700m rộng lớn như thánh đường, lưu giữ hàng ngàn cột thạch nhũ hình tòa sen và ngai vàng tráng lệ.',
    highlightsEn: ['700m deep limestone cathedral', 'Natural stone lotus shapes', 'Refreshing 18°C subterranean air'],
    highlightsVi: ['Vòm hang sâu 700m rộng mênh mông', 'Thạch nhũ hình tòa sen tự nhiên', 'Nhiệt độ trong hang mát rượi 18°C'],
    idealSeasonEn: 'Year-round (Always dry)',
    idealSeasonVi: 'Bốn mùa (Lòng hang luôn khô ráo)',
  },
  {
    id: 'phuong-hoang-moga',
    category: 'cave',
    nameEn: 'Phuong Hoang Cave & Mo Ga Stream',
    nameVi: 'Hang Phượng Hoàng & Suối Mỏ Gà',
    tagEn: 'Cave & Mountain Spring',
    tagVi: 'Kỳ Quan Núi & Suối Nguồn',
    districtEn: 'Vo Nhai District',
    districtVi: 'Huyện Võ Nhai',
    image: 'assets/images/phuong-hoang-moga.jpg',
    featured: false,
    descEn: 'A magnificent twin marvel in Vo Nhai. High above lies the vast Phuong Hoang cave with phoenix-shaped stalagmites; at the foot, icy Mo Ga stream gushes from the mountain with crystal-clear bathing pools.',
    descVi: 'Tuyệt tác thiên nhiên kết hợp tại Võ Nhai. Trên cao là hang Phượng Hoàng kỳ ảo với nhũ đá hình chim phượng hoàng; dưới chân núi là suối Mỏ Gà mát lạnh trong veo, điểm dừng chân tắm mát ngày hè.',
    highlightsEn: ['Phoenix stalagmite sculpture', 'Natural crystal wading pools', 'Panoramic valley mountain views'],
    highlightsVi: ['Nhũ đá hình chim Phượng Hoàng', 'Bể bơi tự nhiên mát lạnh 16-18°C', 'Leo 1.200 bậc đá ngắm thung lũng'],
    idealSeasonEn: 'May – October',
    idealSeasonVi: 'Tháng 5 – 10',
  },
  {
    id: 'cua-tu-stream',
    category: 'trekking',
    nameEn: 'Cua Tu Stream',
    nameVi: 'Suối Cửa Tử',
    tagEn: '7-Canyon Adventure Trek',
    tagVi: 'Thiên Đường Trekking Hẻm Núi',
    districtEn: 'Dai Tu District',
    districtVi: 'Huyện Đại Từ (Sườn Tam Đảo)',
    image: 'assets/images/cua-tu-stream.jpg',
    featured: false,
    descEn: 'Tucked beneath the eastern flank of the Tam Dao mountain range, Cua Tu is an adventurer\'s paradise featuring seven rock gates, deep emerald plunge pools, and smooth natural stone waterslides.',
    descVi: 'Nép mình bên sườn đông dãy Tam Đảo, suối Cửa Tử là thiên đường trekking mạo hiểm với 7 cửa ải đá dựng đứng, máng trượt đá nước mài nhẵn và các vũng bơi sâu trong veo như ngọc bích.',
    highlightsEn: ['7 adventurous canyon gates', 'Natural stone water slides', 'Deep emerald swimming pools'],
    highlightsVi: ['7 cửa ải trekking thử thách', 'Máng trượt đá nước mài tự nhiên', 'Vũng bơi sâu ngọc bích giữa rừng già'],
    idealSeasonEn: 'May – September',
    idealSeasonVi: 'Tháng 5 – 9',
  },
  {
    id: 'nui-coc-lake',
    category: 'lake',
    nameEn: 'Nui Coc Lake',
    nameVi: 'Hồ Núi Cốc',
    tagEn: 'Romantic Legendary Haven',
    tagVi: 'Hồ Nước Huyền Thoại 89 Đảo',
    districtEn: 'Thai Nguyen City / Dai Tu',
    districtVi: 'TP. Thái Nguyên & Đại Từ',
    image: 'assets/images/nui-coc-lake.jpg',
    featured: false,
    descEn: 'A peaceful 2,500-hectare freshwater lake framed by 89 islands and gentle tea hills. Immortalized by the touching love story of Cong and Coc, offering scenic boat rides and lakeside recreation.',
    descVi: 'Vùng hồ nước ngọt rộng hơn 2.500 ha với 89 hòn đảo lớn nhỏ nhấp nhô. Gắn liền với thiên tình sử lãng mạn của chàng Cốc nàng Công, là điểm du ngoạn thuyền buồm và nghỉ dưỡng nổi tiếng.',
    highlightsEn: ['89 verdant islets across lake', 'Love legend of Cong & Coc', 'Sunset pleasure boat cruises'],
    highlightsVi: ['89 hòn đảo xanh biếc giữa lòng hồ', 'Huyền thoại tình yêu Chàng Cốc Nàng Công', 'Du thuyền thưởng ngoạn hoàng hôn'],
    idealSeasonEn: 'Spring, Summer & Autumn',
    idealSeasonVi: 'Mùa xuân, hè & thu',
  },
  {
    id: 'na-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Na Dang Waterfall',
    nameVi: 'Thác Nà Đăng',
    tagEn: 'Untouched Mountain Fall',
    tagVi: 'Dải Lụa Trắng Hoang Sơ',
    districtEn: 'Northern Ba Be Reserve',
    districtVi: 'Rừng Phía Bắc Ba Bể',
    image: 'assets/images/na-dang-waterfall.jpg',
    featured: false,
    descEn: 'A pristine multi-tiered cascade spilling over rocky terraces amidst dense green canopies. Far from crowded tourist spots, Na Dang is an idyllic sanctuary for peaceful forest picnics and nature photography.',
    descVi: 'Ngọn thác nhiều tầng hoang sơ ẩn mình giữa thảm rừng nguyên sinh. Hoàn toàn thoát khỏi sự ồn ào xô bồ, Nà Đăng là chốn dừng chân thanh bình tuyệt đối cho những chuyến dã ngoại và hòa mình vào thiên nhiên.',
    highlightsEn: ['Multi-tiered waterfall streams', 'Completely untouched wilderness', 'Ideal forest picnic retreat'],
    highlightsVi: ['Dòng thác đổ tầng mềm mại trên vách đá', 'Không gian hoang sơ tĩnh lặng tuyệt đối', 'Điểm dã ngoại, chụp ảnh thiên nhiên'],
    idealSeasonEn: 'Summer & Autumn',
    idealSeasonVi: 'Mùa hè & Mùa thu',
  }
];

// --- 7 HISTORICAL EPOCHS TIMELINE DATA ---
const EPOCHS = [
  {
    period: 'BCE – 602 CE',
    titleEn: 'Ancient & Early Periods (Van Lang & Au Lac)',
    titleVi: 'Thời Cổ Đại & Khởi Nguyên (Văn Lang & Âu Lạc)',
    badgeEn: 'Ancient Roots',
    badgeVi: 'Khởi Nguyên',
    descEn: 'During the Hung Kings era, the area belonged to Vu Dinh, one of 15 administrative realms of the ancient Van Lang state. Under the Early Ly Dynasty (544–602), it was part of the Van Xuan state founded by Ly Bi.',
    descVi: 'Thời đại Hùng Vương, đất Thái Nguyên thuộc bộ Vũ Định - một trong 15 bộ của nhà nước Văn Lang. Thời Tiền Lý (544 – 602), vùng đất này trở thành một phần của nhà nước Vạn Xuân do Lý Bí sáng lập.',
    factsEn: ['Vu Dinh Division (Van Lang)', 'Early Ly Dynasty (544-602)', 'Van Xuan State'],
    factsVi: ['Bộ Vũ Định (Nhà nước Văn Lang)', 'Thời Tiền Lý (544 - 602)', 'Nhà nước Vạn Xuân của Lý Bí']
  },
  {
    period: '10th – 19th Century',
    titleEn: 'Feudal Dynasties (Phu Luong Prefecture)',
    titleVi: 'Thời Kỳ Phong Kiến (Phủ Phú Lương)',
    badgeEn: 'Feudal Era',
    badgeVi: 'Phong Kiến',
    descEn: 'During the Ly Dynasty, Thai Nguyen was connected with Phu Luong Prefecture, acting as a crucial defense shield. The name "Thai Nguyen" first appeared in administrative records in 1397. In 1831–1832, Emperor Minh Mang officially designated it as a province.',
    descVi: 'Thời Lý gắn liền với phủ Phú Lương, giữ vị trí phên dậu bảo vệ kinh thành. Danh xưng "Thái Nguyên" chính thức xuất hiện năm 1397. Đến cuộc cải cách hành chính năm 1831–1832 của vua Minh Mạng, Thái Nguyên chính thức trở thành tỉnh.',
    factsEn: ['Ly Dynasty Defense Shield', 'Name "Thai Nguyen" emerges (1397)', 'Emperor Minh Mang reforms (1831)'],
    factsVi: ['Phên dậu bảo vệ phương Bắc thời Lý', 'Danh xưng Thái Nguyên xuất hiện (1397)', 'Cải cách vua Minh Mạng thành lập tỉnh (1831)']
  },
  {
    period: 'Late 19th C – 1945',
    titleEn: 'French Colonial Period & Bac Kan Partition',
    titleVi: 'Thời Kỳ Pháp Thuộc & Thành Lập Tỉnh Bắc Kạn',
    badgeEn: 'Colonial Era',
    badgeVi: 'Pháp Thuộc',
    descEn: 'Underwent multiple administrative shifts under French rule. In 1891, Thai Nguyen Province was temporarily dissolved and re-established in 1892. Crucially, on April 11, 1900, Bac Kan Province was carved out from northern Thai Nguyen.',
    descVi: 'Trải qua nhiều biến động hành chính: bị giải thể năm 1891 và tái lập năm 1892. Ngày 11/04/1900, chính quyền thực dân Pháp chính thức tách một phần lãnh thổ phía Bắc để thành lập tỉnh Bắc Kạn.',
    factsEn: ['Re-established in 1892', 'Bac Kan established (April 11, 1900)', 'Mining & rail networks expanded'],
    factsVi: ['Tái lập tỉnh năm 1892', 'Tách lập tỉnh Bắc Kạn (11/04/1900)', 'Khởi nghĩa Thái Nguyên (Đội Cấn - Lương Ngọc Quyến)']
  },
  {
    period: '1945 – 1954',
    titleEn: 'ATK Dinh Hoa Revolutionary Safe Zone',
    titleVi: 'Thủ Đô Kháng Chiến ATK Định Hóa',
    badgeEn: 'Revolution Base',
    badgeVi: 'Kháng Chiến',
    descEn: 'During the anti-French resistance, Thai Nguyen served as the core of the Viet Bac revolutionary base. Dinh Hoa was designated as the Safe Zone (ATK), where President Ho Chi Minh and central leaders directed the nationwide victory.',
    descVi: 'Trong kháng chiến chống Pháp, Thái Nguyên là trung tâm căn cứ địa Việt Bắc. Huyện Định Hóa trở thành An toàn khu (ATK) - nơi Chủ tịch Hồ Chí Minh và Trung ương Đảng đặt cơ quan đầu não chỉ đạo toàn diện cuộc kháng chiến thắng lợi.',
    factsEn: ['Capital of the Wind (Thủ đô Gió ngàn)', 'President Ho Chi Minh headquarters at Tin Keo', 'Decisive Dien Bien Phu strategy meetings'],
    factsVi: ['Thủ đô Gió ngàn kháng chiến', 'Lán Tỉn Keo - Nơi Bác Hồ làm việc', 'Quyết định mở chiến dịch Điện Biên Phủ']
  },
  {
    period: '1954 – 1996',
    titleEn: 'Bac Thai Province Period & Industrialization',
    titleVi: 'Thời Kỳ Hợp Nhất Tỉnh Bắc Thái & Khu Gang Thép',
    badgeEn: 'Bac Thai Era',
    badgeVi: 'Tỉnh Bắc Thái',
    descEn: 'In 1965, Thai Nguyen and Bac Kan merged to form Bac Thai Province. Thai Nguyen developed as the heavy metallurgy center of northern Vietnam with the historic Thai Nguyen Iron and Steel Complex.',
    descVi: 'Năm 1965, Thái Nguyên và Bắc Kạn hợp nhất thành tỉnh Bắc Thái. Đây là giai đoạn tỉnh phát triển công nghiệp luyện kim then chốt với Khu Gang thép Thái Nguyên - cái nôi ngành thép Việt Nam.',
    factsEn: ['Bac Thai merger (July 1, 1965)', 'Thai Nguyen City established (1962)', 'Cradle of metallurgy industry'],
    factsVi: ['Thành lập tỉnh Bắc Thái (01/07/1965)', 'Thành lập TP. Thái Nguyên (1962)', 'Cái nôi công nghiệp luyện kim miền Bắc']
  },
  {
    period: '1997 – 2025',
    titleEn: 'Re-establishment & Urban Modernization',
    titleVi: 'Tái Lập Tỉnh & Đô Thị Hóa Hiện Đại',
    badgeEn: 'Modern Growth',
    badgeVi: 'Hiện Đại Hóa',
    descEn: 'On January 1, 1997, Thai Nguyen and Bac Kan operated as two separate provinces. Thai Nguyen rapidly urbanized, establishing Song Cong City in 2015 and Pho Yen City in 2022.',
    descVi: 'Ngày 01/01/1997, tỉnh Bắc Thái chia tách trở lại thành hai tỉnh Thái Nguyên và Bắc Kạn. Thái Nguyên bứt phá thành trung tâm kinh tế - giáo dục lớn, thành lập TP. Sông Công (2015) và TP. Phổ Yên (2022).',
    factsEn: ['Separation on Jan 1, 1997', 'Song Cong City (2015)', 'Pho Yen City (2022)'],
    factsVi: ['Vận hành tách tỉnh (01/01/1997)', 'Thành lập TP. Sông Công (2015)', 'Thành lập TP. Phổ Yên (2022)']
  },
  {
    period: 'July 1, 2025 – Present',
    titleEn: 'A Unified Eco-Cultural Realm (2025 – Present)',
    titleVi: 'Hội Tụ & Vươn Mình Cùng Non Nước',
    badgeEn: 'The New Journey',
    badgeVi: 'Hành Trình Mới',
    descEn: 'The historic union bridges the vibrant tea-growing heartland of Tan Cuong with northern Ba Be Lake limestone karst wonders, forging a magnificent 8,375 km² tourism realm for ecotourism and heritage voyages.',
    descVi: 'Sự hội tụ giữa đồi chè Tân Cương phía Nam và viên ngọc xanh hồ Ba Bể phía Bắc tạo nên một không gian du lịch sinh thái và văn hóa rộng lớn 8.375 km², mở ra cơ hội trải nghiệm phong phú cho du khách bốn mùa.',
    factsEn: ['8,375 km² natural realm', 'Ba Be Lake to Tea Terraces', 'Preserving 7 ethnic cultures'],
    factsVi: ['8.375 km² non nước kỳ vĩ', 'Từ nương chè đến hồ Ba Bể', 'Bảo tồn bản sắc 7 dân tộc']
  }
];

// --- REAL-WORLD VERIFIED PAGODAS & TEMPLES ---
const PAGODAS = [
  {
    id: 'duom-temple',
    nameEn: 'Duom Temple (Dương Tự Minh Từ)',
    nameVi: 'Đền Đuổm (Đức Thánh Dương Tự Minh)',
    tagEn: 'National Relic & Intangible Heritage',
    tagVi: 'Di Tích Quốc Gia & Di Sản Phi Vật Thể',
    locationEn: 'Dong Dat, Phu Luong (25km north on Route 3)',
    locationVi: 'Xã Động Đạt, Huyện Phú Lương (Km 25 Quốc lộ 3)',
    image: 'assets/images/den-duom.jpg',
    historyEn: 'Constructed in 1180 under King Ly Cao Tong at the foot of Mount Duom (Diem Son), positioned in harmony with the four geomantic guardians. Honors General Duong Tu Minh, the heroic Tay leader and Royal Son-in-law who guarded the northern border and married two Ly Dynasty princesses, Dien Binh and Thieu Dung.',
    historyVi: 'Khởi dựng năm 1180 triều vua Lý Cao Tông dưới chân núi Điểm Sơn 6 ngọn sừng sững, đắc địa phong thủy tứ tượng. Đền phụng thờ Đức Thánh Đuổm Dương Tự Minh - thủ lĩnh người Tày tài đức, Phò mã Đô úy triều Lý có công bảo vệ biên cương, được vua gả hai Công chúa Diên Bình và Thiều Dung.',
    highlightsEn: ['Lower Temple (Two Royal Princesses)', 'Middle Temple (General Duong Tu Minh)', 'Upper Temple (Sacred Mother on Cliff)'],
    highlightsVi: ['Đền Hạ (Thờ hai vị Công chúa Diên Bình & Thiều Dung)', 'Đền Trung (Chính điện thờ Tướng quân Dương Tự Minh)', 'Đền Thượng (Thờ Thánh Mẫu trên vách núi cao)'],
    festivalEn: '5th & 6th of the 1st lunar month',
    festivalVi: 'Mùng 5 & 6 tháng Giêng âm lịch',
    tipsEn: 'Worship route ascends from bottom to top: Lower Temple → Middle Temple → Upper Temple. Wear sturdy walking shoes.',
    tipsVi: 'Thứ tự hành lễ từ thấp lên cao: Đền Hạ → Đền Trung → leo bậc đá lên Đền Thượng. Nên mang giày thể thao êm ái.',
    souvenirsEn: 'Phu Luong tea, Tan Cuong tea, black olives (trám đen), bamboo sticky rice (Cơm Lam), Tay brocade.',
    souvenirsVi: 'Trà Phú Lương, chè Tân Cương, trám đen Hà Châu, măng khô, cơm lam, vải thổ cẩm Tày - Nùng.',
  },
  {
    id: 'chua-hang',
    nameEn: 'Chua Hang (Kim Son Tu / Cave Sanctuary)',
    nameVi: 'Chùa Hang (Kim Sơn Tự)',
    tagEn: '11th Century Cave Sanctuary',
    tagVi: 'Cổ Tự Trong Lòng Núi Long Cổ',
    locationEn: 'Chua Hang Ward, Thai Nguyen City',
    locationVi: 'Phường Chùa Hang, TP. Thái Nguyên',
    image: 'assets/images/chua-hang-real.jpg',
    historyEn: 'Established around the 11th century under the Ly Dynasty inside the three cavern chambers of Long Co Mountain. During resistance wars, the caves served as a secret unassailable depot for ammunition and government agencies. Designated a National Historical & Scenic Relic in 1999.',
    historyVi: 'Khởi dựng từ thế kỷ XI thời Lý, tọa lạc trọn vẹn trong ba vòm hang đá vôi của dãy núi Long Cổ. Trong kháng chiến, hang chùa từng là kho đạn dược, lương thực và cơ quan sơ tán an toàn tuyệt mật. Năm 1999, chùa được xếp hạng Di tích Lịch sử Danh lam Thắng cảnh cấp Quốc gia.',
    highlightsEn: ['Inner Cave Sanctuary (Kim Son grotto with stalactites)', 'Outer Pagoda on mountain slope', 'Long Co Peak viewpoint over Cau River'],
    highlightsVi: ['Chùa Hang Trong (Động Kim Sơn với thạch nhũ nghìn năm)', 'Chùa Hang Ngoài & Chùa Trên thanh tịnh', 'Đỉnh núi Long Cổ ngắm toàn cảnh dòng sông Cầu'],
    festivalEn: 'Spring Festival: 19th – 21st days of 1st lunar month',
    festivalVi: 'Lễ hội Xuân Chùa Hang: 19 – 21 tháng Giêng âm lịch',
    tipsEn: 'Cave floor can be damp; wear shoes with good grip. Light incense at outdoor courtyard burner to keep cave air fresh.',
    tipsVi: 'Nền hang đá có thể ẩm ướt, nên đi giày chống trượt. Thắp hương tại lư hương lớn ngoài sân để giữ không khí trong lành.',
    souvenirsEn: 'Tân Cương green tea, traditional Bánh Chưng Bờ Đậu, Cơm Lam, lucky bracelets.',
    souvenirsVi: 'Trà Tân Cương, Bánh chưng Bờ Đậu trứ danh, cơm lam ống nứa, chuỗi vòng may mắn.',
  },
  {
    id: 'phu-lien-pagoda',
    nameEn: 'Phu Lien Pagoda (Phù Chân Thiền Tự)',
    nameVi: 'Chùa Phù Liễn (Phù Chân Thiền Tự)',
    tagEn: 'Provincial Buddhist Headquarters',
    tagVi: 'Trụ Sở Ban Trị Sự Phật Giáo Tỉnh',
    locationEn: 'Hoang Van Thu Ward, Thai Nguyen City',
    locationVi: 'Phường Hoàng Văn Thụ, TP. Thái Nguyên',
    image: 'assets/images/chua-phu-lien.jpg',
    historyEn: 'Originating during the Ly Dynasty, relocated in 1896 by French authorities to its current hilltop site. Sheltered anti-French fighters of Hoang Hoa Tham and Doi Can. Houses the golden plaque "Linh Son Phuc Dia" (Sacred Mountain & Auspicious Land).',
    historyVi: 'Mang tên làng Phù Liễn có từ thời Lý. Năm 1896, thực dân Pháp chuyển chùa về vị trí đồi cao hiện nay. Trong phong trào chống Pháp, chùa từng là cơ sở bí mật nuôi giấu nghĩa quân của Hoàng Hoa Thám và Đội Cấn. Chùa lưu giữ bức hoành phi "Linh Sơn Phúc Địa".',
    highlightsEn: ['Main Tam Bao Hall with golden board', 'Outdoor Compassionate Guanyin Statue', 'Ancient Stupa Garden with ancestral relics'],
    highlightsVi: ['Tòa Tam Bảo trang nghiêm với bức đại tự thếp vàng', 'Tượng Phật Bà Quan Âm lộ thiên từ bi', 'Vườn tháp cổ lưu giữ xá lị các đời viện chủ trụ trì'],
    festivalEn: 'Annual Festival: 12th day of 1st lunar month',
    festivalVi: 'Lễ hội chùa ngày 12 tháng Giêng âm lịch',
    tipsEn: 'Dress respectfully (covered shoulders & below knees). Enter via right gate, exit via left. Step over threshold.',
    tipsVi: 'Trang phục lịch sự kín đáo, che vai và dài quá gối. Vào cửa bên phải, ra cửa bên trái. Không dẫm lên bậu cửa.',
    souvenirsEn: 'Premium Tan Cuong tea gift boxes, bodhi bead bracelets, Buddhist lucky amulets.',
    souvenirsVi: 'Hộp trà Tân Cương biếu tặng cao cấp, chuỗi tràng hạt bồ đề, bùa bình an.',
  }
];

// --- HOSPITALS & HEALTHCARE DIRECTORY ---
const HOSPITALS = [
  {
    id: 'bv-dk-tw-tn',
    nameEn: 'Thai Nguyen National General Hospital',
    nameVi: 'Bệnh viện Đa khoa Trung ương Thái Nguyên',
    typeEn: 'Special-Class National Hospital',
    typeVi: 'Bệnh viện Hạng Đặc biệt (Bộ Y tế)',
    descEn: 'Founded in 1951, one of only six special-class hospitals in Vietnam. Over 2,050 beds with advanced medical procedures: kidney transplants, heart surgeries, and IVF.',
    descVi: 'Thành lập năm 1951, 1 trong 6 bệnh viện hạng đặc biệt toàn quốc của Bộ Y tế. Quy mô hơn 2.050 giường bệnh, làm chủ kỹ thuật cao: ghép thận, mổ tim, thụ tinh IVF.',
    address: '479 Luong Ngoc Quyen, Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0208 3855 125',
    emergency: '115 / 0208 3855 125',
  },
  {
    id: 'bv-a-tn',
    nameEn: 'Thai Nguyen A Hospital',
    nameVi: 'Bệnh viện A Thái Nguyên',
    typeEn: 'Provincial General Hospital',
    typeVi: 'Bệnh viện Đa khoa Tuyến tỉnh (Hạng I)',
    descEn: 'Over 60 years of history on Quang Trung Street. Specializes in obstetrics, pediatrics, internal medicine, surgery, and public health.',
    descVi: 'Hơn 60 năm lịch sử trên đường Quang Trung, phường Thịnh Đán. Mũi nhọn chuyên sâu về sản phụ khoa, nhi khoa, ngoại tổng hợp và chăm sóc sức khỏe cộng đồng.',
    address: 'Quang Trung Street, Thinh Dan Ward, Thai Nguyen City',
    phone: '0208 3846 112',
    emergency: '0208 3846 112',
  },
  {
    id: 'bv-pham-ngoc-thach',
    nameEn: 'Pham Ngoc Thach Hospital Thai Nguyen',
    nameVi: 'Bệnh viện Phạm Ngọc Thạch Thái Nguyên',
    typeEn: 'Specialized Hospital',
    typeVi: 'Bệnh viện Chuyên khoa Tuyến tỉnh',
    descEn: 'Formerly Thai Nguyen City Medical Center in Phan Dinh Phung Ward. Provides specialized diagnostic and community care.',
    descVi: 'Tiền thân là Trung tâm Y tế TP. Thái Nguyên tại phường Phan Đình Phùng, thực hiện khám chữa bệnh chuyên sâu và chăm sóc sức khỏe nhân dân.',
    address: 'Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0208 3856 211',
    emergency: '0208 3856 211',
  },
  {
    id: 'dinh-hoa-hospital',
    nameEn: 'Dinh Hoa General Hospital (ATK Region)',
    nameVi: 'Bệnh viện Đa khoa Huyện Định Hóa (Vùng ATK)',
    typeEn: 'District General Hospital',
    typeVi: 'Bệnh viện Đa khoa Tuyến Huyện (Vùng ATK)',
    descEn: 'Established Oct 2, 2008 under Decision 2347/QD-UBND. Equipped with 75 beds, providing medical safety for tourists visiting ATK Safe Zone.',
    descVi: 'Thành lập ngày 02/10/2008 theo QĐ 2347/QĐ-UBND tỉnh. Quy mô 75 giường bệnh, đảm bảo y tế và cấp cứu du khách tham quan ATK Định Hóa.',
    address: 'Cho Chu Town, Dinh Hoa District',
    phone: '0208 3878 223',
    emergency: '0208 3878 223',
  },
  {
    id: 'nui-coc-medical',
    nameEn: 'Nui Coc Lake First Aid Stations',
    nameVi: 'Trạm Y tế Khu vực Hồ Núi Cốc (Phúc Trìu & An Khánh)',
    typeEn: 'Tourism First Aid Outpost',
    typeVi: 'Trạm Y tế Cấp cứu Ban đầu Du lịch',
    descEn: 'Phuc Triu Health Station (East Coast) & An Khanh Health Station (Dai Tu lakeside). 24/7 first aid, heat exhaustion, and motion sickness stabilization.',
    descVi: 'Trạm Y tế Phúc Trìu (Bờ Đông hồ) & Trạm Y tế An Khánh (huyện Đại Từ kề hồ). Trực 24/7 sơ cấp cứu du khách, xử trí chấn thương khi du lịch hồ.',
    address: 'Phuc Triu Commune (City) & An Khanh Commune (Dai Tu)',
    phone: '0208 3825 119',
    emergency: '0208 3825 119',
  }
];

const SEASONS_DATA = {
  spring: {
    nameEn: 'Spring (Feb – Apr)',
    nameVi: 'Mùa Xuân (Tháng 2 – 4)',
    temp: '20 – 23°C',
    rainfallVi: 'Mưa xuân lất phất',
    rainfallEn: 'Light spring drizzle',
    humidity: '82 – 84%',
    descEn: 'Spring awakens the northern midlands with soft mist and refreshing breezes. Tender emerald tea shoots sprout across hillsides while centuries-old ethnic festivals resound across valley villages.',
    descVi: 'Mùa xuân tiết trời mát mẻ, mưa xuân lất phất đánh thức chồi non trên khắp các sườn đồi. Nương chè Tân Cương đâm chồi biếc non tơ, tiếng đàn Tính điệu Then rộn rã khắp các lễ hội xuống đồng.',
    activitiesEn: [
      'Duom Temple pilgrimage & harvest prayers',
      'Witnessing Tan Cuong first tea flush harvest',
      'Ba Be Long Tong festival & traditional dugout boat racing'
    ],
    activitiesVi: [
      'Trẩy hội Đền Đuổm, Chùa Hang đầu xuân cầu an',
      'Ngắm búp chè xuân Tân Cương bừng sắc mật ong',
      'Dự hội Lồng Tồng và xem đua thuyền độc mộc hồ Ba Bể'
    ],
    packEn: 'Light windbreaker, umbrella for spring drizzle, comfortable walking sneakers.',
    packVi: 'Áo khoác gió nhẹ, ô che mưa xuân, giày đi bộ êm ái.'
  },
  summer: {
    nameEn: 'Summer (May – Aug)',
    nameVi: 'Mùa Hạ (Tháng 5 – 8)',
    temp: '28 – 34°C',
    rainfall: 'Frequent afternoon showers',
    humidity: '85 – 88%',
    descEn: 'Summer brings brilliant sunshine and lush mountain canopies. The ideal time to cruise across calm Ba Be waters, canyon-trek cool Cua Tu stream, and explore massive limestone caverns.',
    descVi: 'Mùa hè tràn ngập ánh nắng rực rỡ, non xanh nước biếc soi bóng. Thời điểm hoàn hảo để chèo thuyền ngắm hồ Ba Bể, lội suối Cửa Tử vượt ghềnh đá và khám phá vòm hang động mát rượi 18°C.',
    activitiesEn: [
      'Scenic boat tour across Ba Be Lake & Puong Cave bat haven',
      'Cua Tu stream trekking & natural rock pool swimming',
      'Picnic and cool swim at Mo Ga cave stream'
    ],
    activitiesVi: [
      'Du thuyền hồ Ba Bể, xuyên lòng động Puông kỳ vĩ',
      'Trekking vượt 7 thác suối Cửa Tử trượt máng đá tự nhiên',
      'Dã ngoại và tắm mát dưới dòng suối Mỏ Gà trong vắt'
    ],
    packEn: 'Quick-dry outdoor apparel, waterproof phone pouch, swimwear, river trekking shoes.',
    packVi: 'Trang phục mau khô thể thao, túi chống nước điện thoại, đồ bơi, giày lội suối chống trơn.'
  },
  autumn: {
    nameEn: 'Autumn (Sep – Nov)',
    nameVi: 'Mùa Thu (Tháng 9 – 11)',
    temp: '22 – 27°C',
    rainfall: 'Low to moderate (Dry, crisp air)',
    humidity: '75 – 80%',
    descEn: 'Autumn is the indisputable golden season of Thai Nguyen. Crisp mountain breeze, azure skies, golden sunshine pouring across tea hills, offering premier conditions for trekking and photography.',
    descVi: 'Mùa thu là mùa vàng đẹp nhất trong năm của Thái Nguyên. Trời thu trong xanh vời vợi, gió heo may dịu mát, nắng vàng rót mật trên nương chè mâm xôi, điều kiện lý tưởng tuyệt đối để săn ảnh và trekking.',
    activitiesEn: [
      'Tea hill sunrise photography in Tan Cuong',
      'Trekking to Dau Dang waterfall & Hua Ma cave',
      'Homestay experience in authentic Tay wooden stilt hamlets'
    ],
    activitiesVi: [
      'Săn ảnh bình minh sương sớm trên nương chè Tân Cương',
      'Trekking khám phá thác Đầu Đẳng và thạch nhũ động Hua Mạ',
      'Trải nghiệm văn hóa tại bản nhà sàn Pác Ngòi ven hồ Ba Bể'
    ],
    packEn: 'Camera, light layers for crisp evenings, sun protection, sturdy hiking boots.',
    packVi: 'Máy ảnh, áo khoác mỏng cho ban đêm se lạnh, mũ nón, giày leo núi chuyên dụng.'
  },
  winter: {
    nameEn: 'Winter (Dec – Feb)',
    nameVi: 'Mùa Đông (Tháng 12 – 2)',
    temp: '13 – 18°C',
    rainfall: 'Minimal (Dry season)',
    humidity: '70 – 75%',
    descEn: 'Winter brings cool northern winds and cozy misty mornings. Ideal for cultural exploration, warming up beside stilt-house hearth fires, and tasting freshly roasted Tan Cuong hot tea.',
    descVi: 'Mùa đông mang đến không khí se lạnh khô ráo, sương mù lãng đãng vương trên các rặng núi đá vôi. Rất thích hợp cho du lịch về nguồn văn hóa, quây quần bên bếp lửa nhà sàn và nhâm nhi tách trà Tân Cương ấm nóng.',
    activitiesEn: [
      'Tea appreciation workshops with local artisan masters',
      'Historic ATK Dinh Hoa revolutionary base pilgrimage',
      'Enjoying hot Com Lam and warm Banh Chung by hearth fires'
    ],
    activitiesVi: [
      'Thưởng thức nghệ thuật pha trà cùng nghệ nhân Tân Cương',
      'Về nguồn An toàn khu ATK Định Hóa, thăm lán Tỉn Keo lịch sử',
      'Thưởng thức cơm lam, bánh chưng Bờ Đậu nóng hổi bên bếp than hồng'
    ],
    packEn: 'Warm coat, wool scarf, thermal layers, comfortable walking boots.',
    packVi: 'Áo khoác ấm, khăn quàng cổ, trang phục giữ nhiệt, giày đi bộ thoải mái.'
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTranslations();
  renderDestinations();
  renderEpochTimeline(state.activeEpoch);
  renderSeasons(state.activeSeason);
  renderPagodas();
  renderHospitals();
  renderSavedBadge();
  setupEventListeners();
  setupAudioSynthesizer();
  setupScrollSpy();
  tryInitMap();
  updateCalculator();
  if (typeof initHeroCarousel === 'function') initHeroCarousel();
  if (typeof initBucketList === 'function') initBucketList();
  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initNumberCounters === 'function') initNumberCounters();
  if (typeof initLiveSearch === 'function') initLiveSearch();
  if (typeof initSpotlightCards === 'function') initSpotlightCards();
  if (typeof init3DCardTilt === 'function') init3DCardTilt();
  if (typeof initTimeLapseCurtain === 'function') initTimeLapseCurtain();
});
window.addEventListener('load', tryInitMap);

// --- TRANSLATION / BILINGUAL ENGINE ---
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('tn_lang', lang);
  document.documentElement.lang = lang;

  // Translate all text elements with data-en & data-vi
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = state.lang === 'vi' ? el.getAttribute('data-vi') : el.getAttribute('data-en');
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // Translate elements with title attributes
  document.querySelectorAll('[data-title-en]').forEach(el => {
    const titleText = state.lang === 'vi' ? el.getAttribute('data-title-vi') : el.getAttribute('data-title-en');
    if (titleText) el.setAttribute('title', titleText);
  });

  // Translate filter pills in #landscapes
  const filterPillTranslations = {
    'all': { vi: 'Tất cả (09)', en: 'All (09)' },
    'lake': { vi: 'Hồ nước (02)', en: 'Lakes (02)' },
    'cave': { vi: 'Hang động (03)', en: 'Caves (03)' },
    'waterfall': { vi: 'Thác nước (02)', en: 'Waterfalls (02)' },
    'tea': { vi: 'Nương chè (01)', en: 'Tea Terraces (01)' },
    'trekking': { vi: 'Khám phá (01)', en: 'Trekking (01)' }
  };
  document.querySelectorAll('#landscapes .filter-pill').forEach(pill => {
    const filterKey = pill.getAttribute('data-filter');
    if (filterKey && filterPillTranslations[filterKey]) {
      pill.textContent = state.lang === 'en' ? filterPillTranslations[filterKey].en : filterPillTranslations[filterKey].vi;
    }
  });

  // Translate Hero active scene
  if (typeof switchHeroScene === 'function' && typeof heroSceneIdx !== 'undefined') {
    switchHeroScene(heroSceneIdx);
  }

  // Translate Cinema theater scene
  if (typeof switchCinemaScene === 'function' && typeof cinemaSceneIdx !== 'undefined') {
    switchCinemaScene(cinemaSceneIdx);
  }

  renderDestinations();
  renderEpochTimeline(state.activeEpoch);
  renderSeasons(state.activeSeason);
  renderPagodas();
  renderHospitals();
  renderSavedPlacesList();
  if (typeof updateCalculator === 'function') updateCalculator();

  // Update language toggle button UI
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = state.lang === 'en'
      ? '<span class="text-[11px] font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">EN</span><span class="text-[11px] text-slate-500 font-medium px-2 py-0.5">VI</span>'
      : '<span class="text-[11px] text-slate-500 font-medium px-2 py-0.5">EN</span><span class="text-[11px] font-bold text-white bg-slate-900 px-2.5 py-0.5 rounded-full shadow-xs">VI</span>';
  }
}

function initTranslations() {
  const langToggle = document.getElementById('lang-toggle-btn');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = state.lang === 'en' ? 'vi' : 'en';
      setLanguage(newLang);
      showToast(newLang === 'en' ? 'Switched to English' : 'Đã chuyển sang Tiếng Việt');
    });
  }
  setLanguage(state.lang);
}

// --- RENDER DESTINATIONS (CLEAN TRAVEL CARDS) ---
function renderDestinations() {
  const container = document.getElementById('destinations-grid');
  if (!container) return;

  const searchQuery = (document.getElementById('search-input')?.value || '').toLowerCase().trim();

  const filtered = DESTINATIONS.filter(item => {
    const matchesCategory = state.activeFilter === 'all' || item.category === state.activeFilter;
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const matchesSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery) ||
      desc.toLowerCase().includes(searchQuery) ||
      tag.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        <svg class="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <p class="text-base font-semibold text-slate-800">${state.lang === 'en' ? 'No destinations found matching your search.' : 'Không tìm thấy danh thắng phù hợp với tìm kiếm.'}</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition">
          ${state.lang === 'en' ? 'Clear Filters' : 'Đặt lại bộ lọc'}
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;
    const district = state.lang === 'vi' ? item.districtVi : item.districtEn;
    const season = state.lang === 'vi' ? item.idealSeasonVi : item.idealSeasonEn;
    const isSaved = state.savedPlaces.some(p => p.id === item.id);
    const indexStr = String(idx + 1).padStart(2, '0');

    return `
      <div class="frame-3d-wrapper">
        <article class="frame-3d-card flex flex-col justify-between group">
          <div>
            <!-- 3D Beveled Picture Frame Window -->
            <div class="frame-photo-window relative">
              <!-- Frame Glass Sheen Reflection -->
              <div class="frame-glass-sheen"></div>
              
              <!-- Museum Gallery Number Tag in Brass/Gold -->
              <span class="frame-museum-index font-mono" title="Tác phẩm ${indexStr}">${indexStr}</span>

              <!-- Floating Tag Pill -->
              <span class="frame-depth-badge absolute top-3 left-3 bg-[#1e3321]/90 backdrop-blur-md text-[#e8eddf] border border-white/20 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md font-mono">
                ${tag}
              </span>

              <!-- Floating Bookmark Button -->
              <button onclick="toggleSavePlace('${item.id}', event)" class="frame-depth-badge absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-red-400 transition shadow-md z-20 cursor-pointer" title="Lưu tác phẩm">
                <svg class="w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </button>

              <!-- Image with 3D Depth Zoom -->
              <img src="${item.image}" alt="${name}" loading="lazy">
            </div>

            <!-- 3D Exhibition Plaque -->
            <div class="p-4 pt-4 frame-depth-plaque space-y-2.5">
              <div class="flex items-center justify-between text-xs">
                <span class="flex items-center gap-1.5 font-semibold text-[#4a6038]">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  <span>${district}</span>
                </span>
                <span class="text-[11px] font-mono text-slate-500 bg-[#f4f4ee] px-2 py-0.5 rounded-md border border-[#e4e7db]">
                  ${season}
                </span>
              </div>

              <h3 class="text-lg font-heading font-extrabold text-[#141f16] group-hover:text-[#2d472c] transition tracking-tight line-clamp-1">
                ${name}
              </h3>

              <p class="text-slate-600 text-xs leading-relaxed line-clamp-2 font-light">
                ${desc}
              </p>
            </div>
          </div>

          <!-- Bottom Action Frame Plaque -->
          <div class="p-4 pt-1 frame-depth-action flex items-center gap-2">
            <button onclick="openDestinationModal('${item.id}')" class="flex-1 py-2.5 px-3 bg-[#233522] hover:bg-[#344d32] text-white rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer group-hover:shadow-md">
              <span>${state.lang === 'en' ? 'Explore 3D Artwork' : 'Chiêm Ngưỡng Chi Tiết'}</span>
              <svg class="w-3.5 h-3.5 text-[#d5a755] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button onclick="viewOnMap('${item.id}')" class="py-2.5 px-3 bg-[#f4f4ee] hover:bg-[#e4e7db] text-[#2c3e27] border border-[#d2dbcb] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer" title="${state.lang === 'en' ? 'View on Satellite Map' : 'Xem vị trí trên bản đồ'}">
              <span>📍</span>
              <span class="hidden sm:inline font-mono text-[11px]">${state.lang === 'en' ? 'Map' : 'Bản đồ'}</span>
            </button>
          </div>
        </article>
      </div>
    `;
  }).join('');
  if (typeof initScrollReveal === 'function') setTimeout(initScrollReveal, 40);
  if (typeof initSpotlightCards === 'function') setTimeout(initSpotlightCards, 50);
  if (typeof init3DFrameCards === 'function') setTimeout(init3DFrameCards, 60);
}

// --- RENDER INTERACTIVE EPOCH TIMELINE (NO CLUTTER) ---
function renderEpochTimeline(selectedIndex) {
  state.activeEpoch = selectedIndex;
  const container = document.getElementById('epoch-timeline-container');
  if (!container) return;

  const current = EPOCHS[selectedIndex];
  const title = state.lang === 'vi' ? current.titleVi : current.titleEn;
  const desc = state.lang === 'vi' ? current.descVi : current.descEn;
  const badge = state.lang === 'vi' ? current.badgeVi : current.badgeEn;
  const facts = state.lang === 'vi' ? current.factsVi : current.factsEn;

  container.innerHTML = `
    <!-- Top Stepper Pill Bar -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-200">
      ${EPOCHS.map((ep, idx) => `
        <button onclick="renderEpochTimeline(${idx})" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${idx === selectedIndex ? 'bg-emerald-800 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}">
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === selectedIndex ? 'bg-white text-emerald-900' : 'bg-slate-100 text-slate-600'}">0${idx + 1}</span>
          <span>${ep.period}</span>
        </button>
      `).join('')}
    </div>

    <!-- Active Epoch Detail Showcase -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn">
      <div class="lg:col-span-8 space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
            ${badge}
          </span>
          <span class="text-xs font-mono text-slate-500">${current.period}</span>
        </div>

        <h3 class="text-2xl sm:text-3xl font-travel-heading font-bold text-slate-900 tracking-tight">
          ${title}
        </h3>

        <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
          ${desc}
        </p>

        <div class="pt-2">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">${state.lang === 'en' ? 'Historical Significance & Key Events:' : 'Dấu ấn lịch sử then chốt:'}</h5>
          <div class="flex flex-wrap gap-2 text-xs">
            ${facts.map(f => `
              <span class="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>${f}</span>
              </span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Visual Feature -->
      <div class="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
        <div class="text-xs font-mono text-slate-400 uppercase font-semibold">Epoch 0${selectedIndex + 1} / 07</div>
        <div class="text-lg font-bold text-slate-900 font-serif-display">
          ${selectedIndex === 6 ? 'Kỷ Nguyên Thống Nhất' : 'Hào Khí Phên Dậu'}
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          ${selectedIndex === 6 
            ? 'Không gian du lịch sinh thái và văn hóa rộng lớn 8.375 km², kết hợp hoàn hảo vùng chè Tân Cương phía Nam và non nước hồ Ba Bể nguyên sơ phía Bắc.' 
            : 'Vùng đất giàu truyền thống lịch sử, căn cứ địa cách mạng trung kiên và di sản văn hóa hào hùng qua các thời kỳ.'}
        </p>
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Di Sản &amp; Điểm Đến</span>
          <span class="font-bold text-emerald-800">Thái Nguyên 2026</span>
        </div>
      </div>
    </div>
  `;
}

// --- RENDER CLIMATE & FOUR SEASONS ---
function renderSeasons(seasonKey) {
  state.activeSeason = seasonKey;
  const data = SEASONS_DATA[seasonKey];
  const container = document.getElementById('season-details-container');
  if (!container || !data) return;

  document.querySelectorAll('.season-btn').forEach(btn => {
    if (btn.getAttribute('data-season') === seasonKey) {
      btn.className = 'season-btn px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition bg-slate-900 text-white shadow-sm flex items-center gap-2';
    } else {
      btn.className = 'season-btn px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-2';
    }
  });

  const name = state.lang === 'vi' ? data.nameVi : data.nameEn;
  const desc = state.lang === 'vi' ? data.descVi : data.descEn;
  const activities = state.lang === 'vi' ? data.activitiesVi : data.activitiesEn;
  const pack = state.lang === 'vi' ? data.packVi : data.packEn;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fadeIn">
      <!-- Left Atmospheric Metrics Card -->
      <div class="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-7 rounded-3xl flex flex-col justify-between shadow-md">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
              ${state.lang === 'vi' ? 'Đặc điểm Thời tiết' : 'Weather Guide'}
            </span>
            <span class="text-xs text-slate-400 font-mono">Thái Nguyên</span>
          </div>

          <h4 class="text-2xl font-bold font-travel-heading text-white tracking-tight">${name}</h4>
          <p class="text-xs text-slate-300 font-light mt-2 leading-relaxed">
            ${state.lang === 'vi' ? 'Đặc trưng vi khí hậu chuyển tiếp giữa vùng trung du và vùng núi cao karst.' : 'Microclimate dynamics transition between midland tea slopes and northern karst highlands.'}
          </p>

          <div class="mt-6 space-y-3 font-mono">
            <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <span class="text-xs text-emerald-200 uppercase">${state.lang === 'vi' ? 'Nhiệt độ bình quân' : 'Average Temperature'}</span>
              <span class="text-lg font-bold text-white font-sans">${data.temp}</span>
            </div>

            <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <span class="text-xs text-emerald-200 uppercase">${state.lang === 'vi' ? 'Đặc trưng lượng mưa' : 'Precipitation Rhythm'}</span>
              <span class="text-xs font-semibold text-amber-300">${data.rainfall}</span>
            </div>

            <div class="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <span class="text-xs text-emerald-200 uppercase">${state.lang === 'vi' ? 'Độ ẩm không khí' : 'Relative Humidity'}</span>
              <span class="text-sm font-bold text-teal-300">${data.humidity}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>${state.lang === 'vi' ? 'Mùa mưa chính:' : 'Main Rainy Season:'} <strong>${state.lang === 'vi' ? 'Tháng 5 – Tháng 10' : 'May – October'}</strong></span>
          <span class="text-emerald-400 font-mono font-bold">✓ Verified</span>
        </div>
      </div>

      <!-- Right Experience & Packing Guidance -->
      <div class="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1">
            ${state.lang === 'vi' ? 'Trải nghiệm Khám phá Tối ưu' : 'Optimal Travel Experience'}
          </span>
          <h4 class="text-xl font-bold font-travel-heading text-slate-900 mb-3">${name}</h4>
          <p class="text-sm text-slate-700 leading-relaxed font-light mb-6">
            ${desc}
          </p>

          <div class="space-y-3">
            <h5 class="text-xs font-bold font-travel-heading uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>${state.lang === 'vi' ? 'Hoạt động nổi bật gợi ý:' : 'Curated Highlights & Activities:'}</span>
            </h5>
            <div class="space-y-2">
              ${activities.map(act => `
                <div class="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-800">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  <span class="leading-relaxed">${act}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Packing Suggestion -->
        <div class="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs">
          <div class="flex items-center gap-2 font-bold text-amber-900 mb-1">
            <svg class="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <span>${state.lang === 'vi' ? 'Hành lý & Trang phục khuyên dùng:' : 'Recommended Apparel & Packing:'}</span>
          </div>
          <p class="text-slate-700 leading-relaxed font-light pl-6">${pack}</p>
        </div>
      </div>
    </div>
  `;
  if (typeof initScrollReveal === 'function') setTimeout(initScrollReveal, 40);
}

// --- RENDER PAGODAS & TEMPLES (CLEAN TABBED DESIGN) ---
function renderPagodas() {
  const container = document.getElementById('pagodas-grid');
  if (!container) return;

  container.innerHTML = PAGODAS.map((item, idx) => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const history = state.lang === 'vi' ? item.historyVi : item.historyEn;
    const loc = state.lang === 'vi' ? item.locationVi : item.locationEn;
    const highlights = state.lang === 'vi' ? item.highlightsVi : item.highlightsEn;
    const tips = state.lang === 'vi' ? item.tipsVi : item.tipsEn;
    const souvenirs = state.lang === 'vi' ? item.souvenirsVi : item.souvenirsEn;
    const festival = state.lang === 'vi' ? item.festivalVi : item.festivalEn;

    return `
      <div class="travel-card rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        <!-- Photo Side -->
        <div class="lg:w-5/12 relative min-h-[280px] lg:min-h-full travel-photo-container">
          <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

          <span class="absolute top-4 left-4 bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            ${tag}
          </span>

          <div class="absolute bottom-5 left-5 right-5 text-white">
            <span class="text-xs text-amber-300 font-mono uppercase tracking-wider block">Di tích số 0${idx + 1}</span>
            <h3 class="text-2xl font-travel-heading font-bold text-white mt-1">${name}</h3>
            <p class="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${loc}</span>
            </p>
          </div>
        </div>

        <!-- Narrative Content -->
        <div class="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div>
            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                ${state.lang === 'en' ? 'Historical Significance & Legend' : 'Ý nghĩa Lịch sử & Huyền tích'}
              </h4>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">${history}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                ${state.lang === 'en' ? 'Key Shrines & Sights' : 'Điểm Chiêm bái Tiêu biểu'}
              </h4>
              <ul class="space-y-1.5 text-xs text-slate-700">
                ${highlights.map(hl => `
                  <li class="flex items-center gap-2">
                    <svg class="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>${hl}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 mb-3">
              <strong>${state.lang === 'en' ? 'Festival Date:' : 'Lễ hội chính:'}</strong> ${festival}
            </div>

            <div class="text-xs text-slate-600">
              <strong class="text-slate-900">${state.lang === 'en' ? 'Visitor Note:' : 'Lưu ý khi viếng:'}</strong> ${tips}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="text-slate-600">
              <strong class="text-slate-900">${state.lang === 'en' ? 'Souvenirs:' : 'Quà lưu niệm:'}</strong> ${souvenirs}
            </div>
            <div class="flex items-center gap-2">
              <button onclick="viewOnMap('${item.id}')" class="shrink-0 px-3 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl transition font-semibold flex items-center gap-1 cursor-pointer shadow-2xs" title="${state.lang === 'en' ? 'View on Map' : 'Xem trên bản đồ'}">
                <span>📍</span>
                <span>${state.lang === 'en' ? 'Map' : 'Bản đồ'}</span>
              </button>
              <button onclick="toggleSavePlace('${item.id}', event)" class="shrink-0 px-4 py-2 border border-slate-300 text-slate-800 hover:bg-slate-50 rounded-xl transition font-semibold cursor-pointer">
                ${state.savedPlaces.some(p => p.id === item.id)
                  ? (state.lang === 'en' ? '✓ Saved' : '✓ Đã lưu')
                  : (state.lang === 'en' ? '+ Bookmark' : '+ Lưu vào hành trình')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  if (typeof initScrollReveal === 'function') setTimeout(initScrollReveal, 40);
  if (typeof initSpotlightCards === 'function') setTimeout(initSpotlightCards, 50);
}

// --- RENDER HOSPITALS DIRECTORY ---
function renderHospitals() {
  const container = document.getElementById('hospitals-grid');
  if (!container) return;

  container.innerHTML = HOSPITALS.map(item => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const type = state.lang === 'vi' ? item.typeVi : item.typeEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;

    return `
      <div class="travel-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <span class="inline-block px-2.5 py-1 bg-teal-50 text-teal-800 text-[11px] font-bold rounded-lg border border-teal-200 mb-2">
            ${type}
          </span>

          <h4 class="text-base font-bold text-slate-900 mt-1">${name}</h4>
          <p class="text-slate-600 text-xs mt-2 leading-relaxed">${desc}</p>

          <div class="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div class="flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${item.address}</span>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span><strong>Hotline:</strong> ${item.phone}</span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <a href="tel:${item.phone.replace(/[^0-9]/g, '')}" class="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>${state.lang === 'en' ? 'Emergency Call' : 'Gọi cấp cứu'}</span>
          </a>
          <button onclick="copyToClipboard('${item.phone}', '${state.lang === 'en' ? 'Phone number copied!' : 'Đã sao chép số điện thoại!'}')" class="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition" title="Copy Number">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- DESTINATION MODAL VIEWER ---
function openDestinationModal(id) {
  const item = DESTINATIONS.find(d => d.id === id);
  if (!item) return;

  const modal = document.getElementById('destination-modal');
  const modalContent = document.getElementById('modal-content-container');
  if (!modal || !modalContent) return;

  const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
  const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
  const desc = state.lang === 'vi' ? item.descVi : item.descEn;
  const district = state.lang === 'vi' ? item.districtVi : item.districtEn;
  const highlights = state.lang === 'vi' ? item.highlightsVi : item.highlightsEn;
  const season = state.lang === 'vi' ? item.idealSeasonVi : item.idealSeasonEn;
  const isSaved = state.savedPlaces.some(p => p.id === item.id);

  modalContent.innerHTML = `
    <div class="relative h-72 md:h-96">
      <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"></div>
      
      <button onclick="closeDestinationModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="absolute bottom-6 left-6 right-6 text-white">
        <span class="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded-full mb-2 inline-block">${tag}</span>
        <h2 class="text-2xl md:text-4xl font-travel-heading font-bold text-white tracking-tight">${name}</h2>
        <p class="text-xs text-slate-200 flex items-center gap-1.5 mt-1">
          <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          <span>${district}</span>
        </p>
      </div>
    </div>

    <div class="p-6 md:p-8 space-y-6">
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
          ${state.lang === 'en' ? 'Overview & Highlights' : 'Tổng quan & Trải nghiệm'}
        </h4>
        <p class="text-slate-700 text-sm md:text-base leading-relaxed font-normal">${desc}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">${state.lang === 'en' ? 'Highlights' : 'Điểm nhấn quan trọng'}</h5>
          <ul class="space-y-1.5 text-xs text-slate-600">
            ${highlights.map(h => `<li class="flex items-center gap-2"><svg class="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">${state.lang === 'en' ? 'Best Time to Visit' : 'Thời điểm lý tưởng nhất'}</h5>
          <p class="text-xs text-amber-900 leading-relaxed font-semibold">${season}</p>
          <div class="mt-3 text-xs text-amber-800 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>${state.lang === 'en' ? 'Tip: Check weather forecast before outdoor stream trekking.' : 'Lưu ý: Luôn kiểm tra thời tiết trước khi đi lội suối.'}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button onclick="viewOnMap('${item.id}')" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs" title="${state.lang === 'en' ? 'View on Satellite Map' : 'Xem vị trí trên bản đồ'}">
            <span>📍</span>
            <span>${state.lang === 'en' ? 'View on Map' : 'Xem trên bản đồ'}</span>
          </button>
          <button onclick="toggleSavePlace('${item.id}'); openDestinationModal('${item.id}');" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border ${isSaved ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer">
            <svg class="w-4 h-4 ${isSaved ? 'fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span>${isSaved ? (state.lang === 'en' ? 'Saved' : 'Đã lưu') : (state.lang === 'en' ? 'Save' : 'Lưu')}</span>
          </button>
        </div>

        <a href="#itinerary-builder" onclick="closeDestinationModal()" class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition text-center shadow-sm">
          ${state.lang === 'en' ? 'View in Tour Itineraries' : 'Xem trong lịch trình tour'}
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDestinationModal() {
  const modal = document.getElementById('destination-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// --- SAVED PLACES / WISHLIST ---
function toggleSavePlace(id, event) {
  if (event) event.stopPropagation();

  const target = DESTINATIONS.find(d => d.id === id) || PAGODAS.find(p => p.id === id);
  if (!target) return;

  const index = state.savedPlaces.findIndex(p => p.id === id);
  if (index > -1) {
    state.savedPlaces.splice(index, 1);
    showToast(state.lang === 'en' ? 'Removed from saved itinerary' : 'Đã xóa khỏi danh sách hành trình');
  } else {
    state.savedPlaces.push({
      id: target.id,
      nameEn: target.nameEn,
      nameVi: target.nameVi,
      image: target.image,
      category: target.category || 'spiritual'
    });
    showToast(state.lang === 'en' ? 'Added to your travel itinerary!' : 'Đã thêm vào danh sách hành trình!');
  }

  localStorage.setItem('tn_saved_places', JSON.stringify(state.savedPlaces));
  renderSavedBadge();
  renderDestinations();
  renderPagodas();
  renderSavedPlacesList();
}

function renderSavedBadge() {
  const badges = document.querySelectorAll('.saved-count-badge');
  badges.forEach(b => {
    b.textContent = state.savedPlaces.length;
    if (state.savedPlaces.length > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });
}

function renderSavedPlacesList() {
  const container = document.getElementById('saved-places-container');
  if (!container) return;
  const subEl = document.getElementById('saved-drawer-subtitle');
  if (subEl) {
    subEl.textContent = state.lang === 'vi'
      ? `${state.savedPlaces.length} điểm đến được chọn`
      : `${state.savedPlaces.length} destinations chosen`;
  }

  if (state.savedPlaces.length === 0) {
    container.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <svg class="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        <p class="text-xs font-semibold">${state.lang === 'en' ? 'Your saved list is empty.' : 'Danh sách hành trình của bạn hiện đang trống.'}</p>
        <p class="text-[11px] text-slate-400 mt-1">${state.lang === 'en' ? 'Click heart icons on spots to add them here.' : 'Nhấp biểu tượng trái tim để lưu điểm đến.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.savedPlaces.map(p => {
    const name = state.lang === 'vi' ? p.nameVi : p.nameEn;
    return `
      <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div class="flex items-center gap-3">
          <img src="${p.image}" alt="${name}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h5 class="text-xs font-bold text-slate-900">${name}</h5>
            <span class="text-[10px] text-emerald-800 capitalize font-mono">${p.category}</span>
          </div>
        </div>
        <button onclick="toggleSavePlace('${p.id}')" class="text-red-500 hover:text-red-700 p-2" title="Remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    `;
  }).join('');
}

function openSavedModal() {
  const modal = document.getElementById('saved-modal');
  const panel = document.getElementById('saved-drawer-panel');
  if (!modal) return;
  renderSavedPlacesList();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (panel) {
    requestAnimationFrame(() => {
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
    });
  }
}

function closeSavedModal() {
  const modal = document.getElementById('saved-modal');
  const panel = document.getElementById('saved-drawer-panel');
  if (!modal) return;
  if (panel) {
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
  }
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 260);
}

function clearAllSavedPlaces() {
  if (!state.savedPlaces.length) return;
  state.savedPlaces = [];
  localStorage.setItem('tn_saved_places', JSON.stringify([]));
  renderSavedPlacesList();
  renderSavedBadge();
  showToast(state.lang === 'en' ? 'Cleared all saved spots' : 'Đã xóa toàn bộ điểm đã lưu');
}

// --- ACOUSTIC NATURE SOUNDSCAPE SYNTHESIZER ---
function setupAudioSynthesizer() {
  const soundBtn = document.getElementById('ambient-sound-btn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (state.soundPlaying) {
      stopAudioSynthesizer();
    } else {
      startAudioSynthesizer();
    }
  });
}

function startAudioSynthesizer() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    state.audioCtx = new AudioContext();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    const bufferSize = state.audioCtx.sampleRate * 2;
    const noiseBuffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.015;
      b6 = white * 0.115926;
    }

    const whiteNoise = state.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, state.audioCtx.currentTime);

    const gainNode = state.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.035, state.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(state.audioCtx.destination);
    whiteNoise.start();
    state.ambientNode = whiteNoise;

    const pentatonicNotes = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25];
    function playChime() {
      if (!state.soundPlaying || !state.audioCtx) return;
      const osc = state.audioCtx.createOscillator();
      const chimeGain = state.audioCtx.createGain();
      const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

      chimeGain.gain.setValueAtTime(0, state.audioCtx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.04, state.audioCtx.currentTime + 0.1);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 3.0);

      osc.connect(chimeGain);
      chimeGain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 3.2);
    }

    playChime();
    state.chimeInterval = setInterval(playChime, 3800);

    state.soundPlaying = true;
    updateSoundBtnUI(true);
    showToast(state.lang === 'en' ? 'Serene tea nature sound playing' : 'Đang phát âm thanh thiên nhiên nương chè');
  } catch (err) {
    console.error('Audio synthesizer error:', err);
  }
}

function stopAudioSynthesizer() {
  if (state.ambientNode) {
    try { state.ambientNode.stop(); } catch(e){}
    state.ambientNode = null;
  }
  if (state.chimeInterval) {
    clearInterval(state.chimeInterval);
    state.chimeInterval = null;
  }
  if (state.audioCtx) {
    try { state.audioCtx.close(); } catch(e){}
    state.audioCtx = null;
  }
  state.soundPlaying = false;
  updateSoundBtnUI(false);
  showToast(state.lang === 'en' ? 'Sound paused' : 'Đã tạm dừng âm thanh');
}

function updateSoundBtnUI(isPlaying) {
  const btn = document.getElementById('ambient-sound-btn');
  const waveContainer = document.getElementById('sound-wave-bars');
  const label = document.getElementById('sound-btn-label');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.add('sound-playing', 'bg-emerald-900', 'text-white');
    if (waveContainer) waveContainer.classList.remove('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Audio: On' : 'Âm thanh: Bật';
  } else {
    btn.classList.remove('sound-playing', 'bg-emerald-900', 'text-white');
    if (waveContainer) waveContainer.classList.add('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Field Audio' : 'Âm thanh bản địa';
  }
}

// --- EVENT LISTENERS & UI HELPERS ---
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDestinations();
    });
  }

  // Quick Filter Pill Buttons
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.getAttribute('data-filter') || 'all';
      renderDestinations();
    });
  });

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById('reading-progress');
    if (bar) bar.style.width = scrolled + '%';


  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  state.activeFilter = 'all';
  document.querySelectorAll('.filter-pill').forEach(b => {
    if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
    else b.classList.remove('active');
  });
  renderDestinations();
}

function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy');
  });
}

function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none flex items-center gap-2 border border-slate-700';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span>${message}</span>
  `;
  toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');

  setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
  }, 2600);
}

function setupScrollSpy() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.pageYOffset >= top) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('text-emerald-800', 'font-bold');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('text-emerald-800', 'font-bold');
      }
    });
  });
}

function printItinerary() {
  window.print();
}

window.setLanguage = setLanguage;
window.renderEpochTimeline = renderEpochTimeline;
window.renderSeasons = renderSeasons;
window.openDestinationModal = openDestinationModal;
window.closeDestinationModal = closeDestinationModal;
window.toggleSavePlace = toggleSavePlace;
window.openSavedModal = openSavedModal;
window.closeSavedModal = closeSavedModal;
window.copyToClipboard = copyToClipboard;
window.resetFilters = resetFilters;
window.printItinerary = printItinerary;


// ============================================================
// INTERACTIVE MAP (Leaflet.js + MarkerCluster)
// ============================================================
const MAP_POINTS = [
  // Ba Be Cluster (North)
  { id: 'babe-lake',          name: 'Hồ Ba Bể',           nameEn: 'Ba Be Lake',           lat: 22.3987, lng: 105.6368, cat: 'lake',      img: 'assets/images/babe-lake.jpg' },
  { id: 'puong-cave',         name: 'Động Puông',          nameEn: 'Puong Cave',           lat: 22.3760, lng: 105.6295, cat: 'cave',      img: 'assets/images/puong-cave.jpg' },
  { id: 'dau-dang-waterfall', name: 'Thác Đầu Đẳng',      nameEn: 'Dau Dang Waterfall',   lat: 22.3550, lng: 105.6150, cat: 'waterfall', img: 'assets/images/dau-dang-waterfall.jpg' },
  { id: 'hua-ma-cave',        name: 'Động Hua Mạ',         nameEn: 'Hua Ma Cave',          lat: 22.4200, lng: 105.7000, cat: 'cave',      img: 'assets/images/hua-ma-cave.jpg' },
  // Central-South Cluster
  { id: 'tan-cuong-tea-hills',name: 'Đồi Chè Tân Cương',  nameEn: 'Tan Cuong Tea Hills',  lat: 21.6421, lng: 105.7533, cat: 'tea',       img: 'assets/images/tan-cuong-tea.jpg' },
  { id: 'nui-coc-lake',       name: 'Hồ Núi Cốc',         nameEn: 'Nui Coc Lake',         lat: 21.7245, lng: 105.6612, cat: 'lake',      img: 'assets/images/nui-coc-lake.jpg' },
  { id: 'phuong-hoang-moga',  name: 'Hang Phượng Hoàng & Mỏ Gà', nameEn: 'Phuong Hoang Cave & Mo Ga', lat: 21.7850, lng: 105.6200, cat: 'cave', img: 'assets/images/mo-ga-cave.jpg' },
  { id: 'hang-pagoda',        name: 'Chùa Hang',           nameEn: 'Hang Pagoda',          lat: 21.5940, lng: 105.8356, cat: 'temple',    img: 'assets/images/chua-hang.jpg' },
  { id: 'duom-temple',        name: 'Đền Đuổm',            nameEn: 'Duom Temple',          lat: 21.8731, lng: 105.8012, cat: 'temple',    img: 'assets/images/den-duom.jpg' },
  // Dai Tu - Dinh Hoa Cluster
  { id: 'atk-dinh-hoa',       name: 'ATK Định Hóa',        nameEn: 'ATK Dinh Hoa',         lat: 21.9980, lng: 105.6042, cat: 'temple',    img: 'assets/images/atk-dinh-hoa.jpg' },
  { id: 'cua-tu-stream',      name: 'Suối Cửa Tử',         nameEn: 'Cua Tu Stream',        lat: 21.8200, lng: 105.5800, cat: 'waterfall', img: 'assets/images/cua-tu-stream.jpg' },
  { id: 'na-dang-waterfall',  name: 'Thác Na Đắng',        nameEn: 'Na Dang Waterfall',    lat: 22.0150, lng: 105.5600, cat: 'waterfall', img: 'assets/images/na-dang-waterfall.jpg' },
];

const CAT_COLORS = {
  lake:      { bg: '#3b82f6', text: '#1e3a8a', label: 'Hồ & Sông', labelEn: 'Lake & River' },
  cave:      { bg: '#8b5cf6', text: '#3b0764', label: 'Hang động', labelEn: 'Caves' },
  waterfall: { bg: '#06b6d4', text: '#0c4a6e', label: 'Thác nước', labelEn: 'Waterfalls' },
  tea:       { bg: '#10b981', text: '#064e3b', label: 'Vùng chè', labelEn: 'Tea Plantations' },
  temple:    { bg: '#f59e0b', text: '#78350f', label: 'Đền, chùa & Di tích', labelEn: 'Temples & Heritage' },
  trekking:  { bg: '#ef4444', text: '#7f1d1d', label: 'Trekking', labelEn: 'Trekking Trails' },
};

function makeMarkerIcon(cat) {
  const c = CAT_COLORS[cat] || CAT_COLORS.temple;
  // Apple Maps Style Pin with drop shadow and glossy center
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
    <defs>
      <filter id="applePinShadow" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="rgba(0,0,0,0.45)"/>
      </filter>
    </defs>
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 28 18 28s18-14.5 18-28C36 8.06 27.94 0 18 0z" fill="${c.bg}" stroke="#ffffff" stroke-width="2.2" filter="url(#applePinShadow)"/>
    <circle cx="18" cy="18" r="7.5" fill="#ffffff" opacity="0.98"/>
    <circle cx="18" cy="18" r="4.2" fill="${c.bg}"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -44],
  });
}

let tnMap = null;
let mapRetries = 0;
let mapMarkers = {};
let mapClusters = null;

function tryInitMap() {
  if (window.L) {
    initInteractiveMap();
  } else if (mapRetries < 30) {
    mapRetries++;
    setTimeout(tryInitMap, 250);
  }
}

// Map Layers Storage
let mapLayers = {
  satellite: null,
  satelliteLabels: null,
  terrain: null,
  streets: null
};
let currentMapLayer = 'satellite';
let userLocationMarker = null;

function setMapLayer(mode) {
  if (!tnMap || !mapLayers.satellite) return;

  // Remove active base layers
  if (tnMap.hasLayer(mapLayers.satellite)) tnMap.removeLayer(mapLayers.satellite);
  if (tnMap.hasLayer(mapLayers.satelliteLabels)) tnMap.removeLayer(mapLayers.satelliteLabels);
  if (tnMap.hasLayer(mapLayers.terrain)) tnMap.removeLayer(mapLayers.terrain);
  if (tnMap.hasLayer(mapLayers.streets)) tnMap.removeLayer(mapLayers.streets);

  if (mode === 'satellite') {
    mapLayers.satellite.addTo(tnMap);
    mapLayers.satelliteLabels.addTo(tnMap);
  } else if (mode === 'terrain') {
    mapLayers.terrain.addTo(tnMap);
  } else if (mode === 'streets') {
    mapLayers.streets.addTo(tnMap);
  }
  currentMapLayer = mode;

  // Update button active state
  ['satellite', 'terrain', 'streets'].forEach(k => {
    const btn = document.getElementById('btn-layer-' + k);
    if (btn) {
      if (k === mode) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  showToast(mode === 'satellite' ? 'Đang xem Bản đồ Vệ tinh thực tế' : (mode === 'terrain' ? 'Đang xem Bản đồ Địa hình thực địa' : 'Đang xem Bản đồ Đường phố'));
}

function locateUserPosition() {
  if (!tnMap) return;

  if (navigator.geolocation) {
    showToast('Đang định vị vị trí GPS của bạn...');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;

        if (userLocationMarker) tnMap.removeLayer(userLocationMarker);

        // Apple Pulsing Blue Dot Marker
        const userIcon = L.divIcon({
          html: `<div style="position:relative;width:24px;height:24px;">
            <div style="position:absolute;inset:0;background:rgba(0,113,227,0.3);border-radius:999px;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute;inset:3px;background:#0071e3;border:2.5px solid #ffffff;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>
          </div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        userLocationMarker = L.marker([uLat, uLng], { icon: userIcon })
          .bindPopup('<div style="font-weight:700;font-size:12px;color:#1d1d1f;padding:2px;">📍 Vị trí hiện tại của bạn</div>')
          .addTo(tnMap);

        // Fit view to include user and Thai Nguyen center
        const bounds = L.latLngBounds([[uLat, uLng], [21.95, 105.68]]);
        tnMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        showToast('Đã định vị vị trí của bạn thành công!');
      },
      err => {
        showToast('Không thể lấy GPS. Mặc định tính từ Thủ đô Hà Nội (~75 km tới Thái Nguyên).');
        tnMap.flyTo([21.0285, 105.8542], 10);
      },
      { timeout: 7000 }
    );
  } else {
    showToast('Trình duyệt không hỗ trợ Geolocation.');
  }
}

function resetMapView() {
  if (!tnMap) return;
  tnMap.flyTo([21.95, 105.68], 9, { duration: 1.2 });
}

function initInteractiveMap() {
  const mapEl = document.getElementById('tn-map');
  if (!mapEl || !window.L) return;
  if (tnMap) return;

  // Realistic Base Layers
  mapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; High-Resolution Satellite'
  });

  mapLayers.satelliteLabels = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
  });

  mapLayers.terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Topographic Terrain'
  });

  mapLayers.streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  });

  // Init map with REALISTIC SATELLITE as DEFAULT!
  tnMap = L.map('tn-map', {
    center: [21.95, 105.68],
    zoom: 9,
    scrollWheelZoom: false,
    attributionControl: false,
    layers: [mapLayers.satellite, mapLayers.satelliteLabels]
  });

  const clusters = (window.L && window.L.markerClusterGroup)
    ? L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 55,
      })
    : L.featureGroup();

  MAP_POINTS.forEach(pt => {
    const marker = L.marker([pt.lat, pt.lng], { icon: makeMarkerIcon(pt.cat), title: pt.name });
    const catInfo = CAT_COLORS[pt.cat] || CAT_COLORS.temple;
    const catLabel = state.lang === 'vi' ? catInfo.label : catInfo.labelEn;
    const ptTitle = state.lang === 'vi' ? pt.name : pt.nameEn;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pt.lat},${pt.lng}`;
    const dest = DESTINATIONS.find(d => d.id === pt.id);

    const descSnippet = dest
      ? (state.lang === 'vi' ? dest.descVi : dest.descEn).substring(0, 95) + '...'
      : '';

    // Apple Style Glassmorphic Popup
    const popupHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Inter',sans-serif;width:230px;padding:3px;">
        <div style="border-radius:14px;overflow:hidden;margin-bottom:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
          <img src="${pt.img}" alt="${ptTitle}" style="width:100%;height:115px;object-fit:cover;display:block;" onerror="this.style.display='none'">
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span style="display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:980px;background:${catInfo.bg}22;color:${catInfo.bg};letter-spacing:-0.01em;">${catLabel}</span>
          <span style="font-size:10px;color:#86868b;font-family:monospace;">${pt.lat.toFixed(2)}°N</span>
        </div>
        <div style="font-size:15px;font-weight:800;color:#1d1d1f;letter-spacing:-0.02em;margin-bottom:4px;line-height:1.25;">${ptTitle}</div>
        ${descSnippet ? `<div style="font-size:11.5px;color:#515154;line-height:1.45;margin-bottom:9px;font-weight:400;">${descSnippet}</div>` : ''}
        <div style="display:flex;gap:6px;margin-top:6px;">
          ${dest ? `<button onclick="closeMapPopup();openDestinationModal('${pt.id}')" style="flex:1;padding:8px 8px;background:#f5f5f7;color:#1d1d1f;border:1px solid #d2d2d7;border-radius:10px;font-size:11px;font-weight:700;cursor:pointer;transition:all 0.2s;">${state.lang==='vi'?'Chi tiết':'Details'}</button>` : ''}
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="flex:1;padding:8px 8px;background:#0071e3;color:#ffffff;border-radius:10px;font-size:11px;font-weight:700;text-decoration:none;text-align:center;display:block;box-shadow:0 2px 6px rgba(0,113,227,0.3);transition:all 0.2s;">${state.lang==='vi'?'Dẫn đường':'Directions'}</a>
        </div>
      </div>
    `;
    marker.bindPopup(popupHtml, { maxWidth: 250, minWidth: 230 });
    mapMarkers[pt.id] = marker;
    clusters.addLayer(marker);
  });

  mapClusters = clusters;
  tnMap.addLayer(clusters);

  // Apple Pill Style Province Crest Badge
  L.marker([22.08, 105.7], {
    icon: L.divIcon({
      html: '<div style="background:rgba(29,29,31,0.85);backdrop-filter:blur(20px);color:#ffffff;border:1px solid rgba(255,255,255,0.25);border-radius:980px;padding:4px 14px;font-size:11px;font-weight:800;font-family:-apple-system,BlinkMacSystemFont,sans-serif;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,0.35);letter-spacing:0.5px;">THÁI NGUYÊN &bull; 8.375 KM²</div>',
      className: '',
      iconAnchor: [85, 14],
    })
  }).addTo(tnMap);

  setTimeout(() => { if (tnMap) tnMap.invalidateSize(); }, 400);
}
function closeMapPopup() {
  if (tnMap) tnMap.closePopup();
}

// Navigate and highlight destination on interactive map
function viewOnMap(destId) {
  if (typeof closeDestinationModal === 'function') closeDestinationModal();
  if (tnMap) tnMap.closePopup();

  const mapSection = document.getElementById('interactive-map');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (!tnMap && typeof initInteractiveMap === 'function') {
    initInteractiveMap();
  }

  const pt = MAP_POINTS.find(p => p.id === destId);
  if (!pt) {
    console.warn('Destination point not found on map:', destId);
    return;
  }

  const destName = state.lang === 'vi' ? pt.name : pt.nameEn;
  showToast(state.lang === 'vi' ? `Đang định vị trên bản đồ: ${destName}` : `Locating on map: ${destName}`);

  setTimeout(() => {
    if (!tnMap) return;
    tnMap.invalidateSize();
    const marker = mapMarkers[pt.id];

    try {
      tnMap.flyTo([pt.lat, pt.lng], 13.5, { duration: 0.9 });
    } catch (e) {
      tnMap.setView([pt.lat, pt.lng], 13.5);
    }

    setTimeout(() => {
      if (!tnMap) return;
      tnMap.setView([pt.lat, pt.lng], 13.5);
      if (marker) {
        if (mapClusters && typeof mapClusters.zoomToShowLayer === 'function' && mapClusters.hasLayer(marker)) {
          mapClusters.zoomToShowLayer(marker, () => {
            marker.openPopup();
          });
        }
        marker.openPopup();
      }
    }, 500);
  }, 350);
}
window.viewOnMap = viewOnMap;

// ============================================================
// SMART TOUR COST CALCULATOR
// ============================================================
const COST_TABLE = {
  budget: {
    perDay: { transport: 120000, food: 160000, activities: 90000, guide: 0 },
    perNight: { accommodation: 250000 },
    groupDiscount: { 1: 1.0, 2: 0.95, 4: 0.90, 8: 0.82 },
  },
  standard: {
    perDay: { transport: 290000, food: 360000, activities: 190000, guide: 150000 },
    perNight: { accommodation: 650000 },
    groupDiscount: { 1: 1.0, 2: 0.92, 4: 0.85, 8: 0.78 },
  },
  premium: {
    perDay: { transport: 650000, food: 850000, activities: 450000, guide: 450000 },
    perNight: { accommodation: 1900000 },
    groupDiscount: { 1: 1.0, 2: 0.90, 4: 0.80, 8: 0.72 },
  },
};

function formatVND(n) {
  if (n >= 1000000) {
    const mil = n / 1000000;
    return mil.toFixed(1).replace(/\.0$/, '') + ' triệu ₫';
  }
  return n.toLocaleString('vi-VN') + ' ₫';
}

function updateCalculator() {
  const daysEl   = document.getElementById('calc-days');
  const pplEl    = document.getElementById('calc-people');
  const styleEl  = document.getElementById('calc-style');
  if (!daysEl || !pplEl || !styleEl) return;

  const days   = parseInt(daysEl.value || 2);
  const people = parseInt(pplEl.value || 2);
  const style  = styleEl.value || 'standard';

  const tbl = COST_TABLE[style] || COST_TABLE.standard;
  const nights = Math.max(0, days - 1);

  const discountKeys = [1, 2, 4, 8];
  const closestKey = discountKeys.reduce((prev, curr) =>
    Math.abs(curr - people) < Math.abs(prev - people) ? curr : prev
  );
  const discount = tbl.groupDiscount[closestKey] || 1.0;

  const transport     = Math.round(tbl.perDay.transport    * days   * people * discount);
  const food          = Math.round(tbl.perDay.food         * days   * people * discount);
  const activities    = Math.round(tbl.perDay.activities   * days   * people * discount);
  const guide         = Math.round(tbl.perDay.guide        * days            * discount);
  const accommodation = Math.round(tbl.perNight.accommodation * nights * Math.ceil(people / 2) * discount);
  const total         = transport + accommodation + food + activities + guide;

  const breakdown = document.getElementById('calc-breakdown');
  if (breakdown) {
    const isVi = state.lang === 'vi';
    const rows = [
      {
        label: isVi ? 'Phương tiện di chuyển (xe đưa đón, xăng xe)' : 'Transportation (Transfers, Fuel)',
        icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m14 0h2m-2 0H9m4 0a2 2 0 100-4 2 2 0 000 4z',
        value: transport,
        pct: total ? Math.round(transport / total * 100) : 0,
        color: 'bg-blue-500',
      },
      {
        label: isVi ? `Lưu trú (${nights} đêm - Khách sạn / Homestay)` : `Accommodation (${nights} nights)`,
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        value: accommodation,
        pct: total ? Math.round(accommodation / total * 100) : 0,
        color: 'bg-purple-500',
      },
      {
        label: isVi ? 'Ẩm thực & Thưởng trà (3 bữa/ngày)' : 'Dining & Tea Experiences (3 meals/day)',
        icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
        value: food,
        pct: total ? Math.round(food / total * 100) : 0,
        color: 'bg-amber-500',
      },
      {
        label: isVi ? 'Vé tham quan, du thuyền Ba Bể & trải nghiệm' : 'Attraction Tickets & Ba Be Boat Cruises',
        icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
        value: activities,
        pct: total ? Math.round(activities / total * 100) : 0,
        color: 'bg-emerald-500',
      },
      {
        label: isVi ? 'Hướng dẫn viên địa phương & Bảo hiểm du lịch' : 'Local Guide & Travel Insurance',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        value: guide,
        pct: total ? Math.round(guide / total * 100) : 0,
        color: 'bg-rose-500',
      },
    ];

    breakdown.innerHTML = rows.map(row => `
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700/60">
          <svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${row.icon}"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-slate-300 font-medium truncate">${row.label}</span>
            <span class="text-xs font-bold text-white ml-2 shrink-0 font-mono">${formatVND(row.value)}</span>
          </div>
          <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div class="${row.color} h-full rounded-full transition-all duration-700" style="width:${row.pct}%"></div>
          </div>
        </div>
        <span class="text-[10px] text-slate-400 font-mono w-7 text-right shrink-0">${row.pct}%</span>
      </div>
    `).join('');
  }

  const totalEl = document.getElementById('calc-total');
  const ppEl    = document.getElementById('calc-per-person');
  if (totalEl) totalEl.textContent = formatVND(total);
  if (ppEl) {
    const isVi = state.lang === 'vi';
    ppEl.textContent = people > 1
      ? (isVi ? `(~${formatVND(Math.round(total / people))} / người)` : `(~${formatVND(Math.round(total / people))} / person)`)
      : (isVi ? '(Giá trọn gói 1 khách)' : '(Solo package)');
  }

  window._lastCalcData = { days, people, style, total, transport, accommodation, food, activities, guide, nights };
}

function exportCalcICS() {
  const data = window._lastCalcData;
  if (!data) return;

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 14); // default 2 weeks ahead

  function fmtICSDate(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  const events = [];
  const itineraries = [
    { title: 'Ngày 1: Đồi Chè Tân Cương & Khám Phá Cổ Tự', desc: 'Thưởng trà Tân Cương, chiêm bái Đền Đuổm, du thuyền Hồ Núi Cốc.' },
    { title: 'Ngày 2: Kỳ Quan Hồ Ba Bể & Động Puông', desc: 'Du thuyền sông Năng, vòm karst động Puông, ghé thác Đầu Đẳng, nghỉ đêm bản Pác Ngòi.' },
    { title: 'Ngày 3: Thánh Đường Hua Mạ & Thủ Đô Gió Ngàn ATK', desc: 'Thạch nhũ Hua Mạ, lán Tỉn Keo, di tích ATK Định Hóa và mua sắm đặc sản chè.' },
    { title: 'Ngày 4: Trekking Suối Cửa Tử & Rừng Nguyên Sinh', desc: 'Khám phá thiên nhiên hoang sơ Đại Từ, ngâm suối nước trong vắt.' },
    { title: 'Ngày 5: Khám Phá Làng Nghề & Trở Về', desc: 'Học sao chè truyền thống và khởi hành về Hà Nội.' },
  ];

  for (let i = 0; i < data.days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    d.setHours(8, 0, 0);

    const nextD = new Date(d);
    nextD.setHours(18, 0, 0);

    const item = itineraries[i] || { title: `Ngày ${i + 1}: Khám Phá Thái Nguyên`, desc: 'Hành trình trải nghiệm văn hóa và cảnh quan thiên nhiên.' };

    events.push(`BEGIN:VEVENT
DTSTART:${fmtICSDate(d)}
DTEND:${fmtICSDate(nextD)}
SUMMARY:${item.title}
DESCRIPTION:${item.desc} | Đoàn: ${data.people} khách | Dự toán: ${formatVND(data.total)}
LOCATION:Thai Nguyen Province, Vietnam
STATUS:CONFIRMED
END:VEVENT`);
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Thai Nguyen Tourism Portal//Official 2026//VI
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Du Lịch Thái Nguyên (${data.days}N${data.nights}Đ)
${events.join('\n')}
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `du-lich-thai-nguyen-${data.days}ngay-${data.people}nguoi.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(state.lang === 'vi' ? 'Đã xuất file lịch .ics thành công!' : 'Exported calendar .ics successfully!');
}

function printTourGuide() {
  const data = window._lastCalcData;
  const style = data ? data.style : 'standard';
  const stylesVi = { budget: 'Tiết kiệm', standard: 'Tiêu chuẩn', premium: 'Cao cấp' };
  const days = data ? data.days : 2;
  const nights = data ? data.nights : 1;
  const people = data ? data.people : 2;

  const printWin = window.open('', '_blank');
  if (!printWin) {
    showToast(state.lang === 'vi' ? 'Trình duyệt chặn mở popup. Vui lòng cho phép popup.' : 'Popup was blocked by browser.');
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cẩm Nang Du Lịch Thái Nguyên 2026</title>
  <style>
    body { font-family: 'Times New Roman', Georgia, serif; margin: 40px; color: #111; line-height: 1.6; }
    .header { border-bottom: 3px double #065f46; padding-bottom: 12px; margin-bottom: 24px; text-align: center; }
    h1 { color: #065f46; font-size: 24px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px; }
    .sub { color: #555; font-size: 13px; font-style: italic; }
    h2 { color: #064e3b; font-size: 16px; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 20px; }
    .cost-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
    .cost-table th, .cost-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .cost-table th { background: #f1f5f9; font-weight: bold; }
    .cost-table td:last-child { text-align: right; font-weight: bold; }
    .total-row td { font-size: 15px; color: #065f46; font-weight: bold; border-top: 2px solid #065f46; border-bottom: 2px solid #065f46; }
    .highlights { font-size: 13px; }
    .highlights li { margin-bottom: 6px; }
    .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #64748b; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Cẩm Nang &amp; Kế Hoạch Du Lịch Thái Nguyên</h1>
    <div class="sub">Tỉnh Thái Nguyên Mới (Sau Sáp Nhập 2025) · Cổng Thông Tin Chính Thức 2026</div>
  </div>

  <div class="meta-box">
    <strong>Thời gian:</strong> ${days} Ngày / ${nights} Đêm &nbsp;|&nbsp;
    <strong>Đoàn:</strong> ${people} khách &nbsp;|&nbsp;
    <strong>Phong cách:</strong> ${stylesVi[style] || 'Tiêu chuẩn'} &nbsp;|&nbsp;
    <strong>Ngày lập:</strong> ${new Date().toLocaleDateString('vi-VN')}
  </div>

  <h2>1. Dự Toán Chi Phí Trọn Gói Dự Kiến</h2>
  ${data ? `
  <table class="cost-table">
    <thead>
      <tr>
        <th>Hạng mục chi phí</th>
        <th style="text-align:right;">Số tiền</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Phương tiện di chuyển (xe đón/tiễn, xăng xe)</td><td>${formatVND(data.transport)}</td></tr>
      <tr><td>Lưu trú (${nights} đêm - Khách sạn / Homestay)</td><td>${formatVND(data.accommodation)}</td></tr>
      <tr><td>Ẩm thực (3 bữa chính/ngày + đặc sản trà)</td><td>${formatVND(data.food)}</td></tr>
      <tr><td>Vé tham quan, du thuyền Hồ Ba Bể & hoạt động</td><td>${formatVND(data.activities)}</td></tr>
      <tr><td>Hướng dẫn viên địa phương & bảo hiểm</td><td>${formatVND(data.guide)}</td></tr>
      <tr class="total-row"><td>TỔNG CỘNG DỰ TOÁN</td><td>${formatVND(data.total)}</td></tr>
    </tbody>
  </table>
  <div style="font-size:12px;color:#64748b;margin-top:6px;text-align:right;">
    Tương đương ~<strong>${formatVND(Math.round(data.total / people))}</strong> / người
  </div>
  ` : ''}

  <h2>2. Điểm Đến Không Thể Bỏ Lỡ</h2>
  <ul class="highlights">
    <li><strong>Hồ Ba Bể:</strong> Top 20 hồ nước ngọt tự nhiên karst lớn nhất thế giới, khu Ramsar quốc tế.</li>
    <li><strong>Động Puông:</strong> Hang sông ngầm dài 300m luồn qua lòng núi đá vôi hùng vĩ.</li>
    <li><strong>Đồi chè Tân Cương:</strong> Đệ nhất danh trà Việt Nam với những nương chè mâm xôi uốn lượn.</li>
    <li><strong>Đền Đuổm:</strong> Cổ tự nghìn năm thờ Dương Tự Minh, kiến trúc thuần Việt dưới chân núi Điểm Sơn.</li>
    <li><strong>ATK Định Hóa:</strong> Di tích quốc gia đặc biệt Thủ đô Gió ngàn kháng chiến.</li>
  </ul>

  <h2>3. Liên Hệ Hỗ Trợ Khẩn Cấp</h2>
  <p style="font-size:12px;margin:4px 0;">
    Cấp cứu: <strong>115</strong> | Công an: <strong>113</strong> | PCCC: <strong>114</strong><br>
    Bệnh viện Đa khoa TW Thái Nguyên: <strong>0208 3855 125</strong> | BV Đa khoa Bắc Kạn: <strong>0209 3870 115</strong>
  </p>

  <div class="footer">
    Trích xuất từ Cổng Thông Tin Du Lịch Thái Nguyên (thainguyen.gov.vn) · Bản quyền 2026.
  </div>
</body>
</html>`);

  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    printWin.print();
  }, 400);
}

function shareCalcResult() {
  const data = window._lastCalcData;
  const isVi = state.lang === 'vi';
  const text = data
    ? (isVi
        ? `Cẩm nang Du lịch Thái Nguyên (${data.days}N${data.nights}Đ - ${data.people} khách) - Dự toán: ${formatVND(data.total)} (~${formatVND(Math.round(data.total / data.people))}/người).
Khám phá tại: https://thaopxtn.github.io/thai-nguyen-tourism/`
        : `Thai Nguyen Travel Plan (${data.days}D${data.nights}N - ${data.people} pax) - Estimate: ${formatVND(data.total)}.
Explore: https://thaopxtn.github.io/thai-nguyen-tourism/`)
    : 'Khám phá du lịch Thái Nguyên 2026: https://thaopxtn.github.io/thai-nguyen-tourism/';

  if (navigator.share) {
    navigator.share({
      title: 'Du Lịch Thái Nguyên 2026',
      text: text,
      url: 'https://thaopxtn.github.io/thai-nguyen-tourism/'
    }).catch(() => {
      copyToClipboard(text, isVi ? 'Đã sao chép liên kết chia sẻ!' : 'Copied share text!');
    });
  } else {
    copyToClipboard(text, isVi ? 'Đã sao chép kế hoạch và dự toán vào clipboard!' : 'Copied plan & budget to clipboard!');
  }
}

// Global window exposure
window.initInteractiveMap = initInteractiveMap;
window.tryInitMap = tryInitMap;
window.closeMapPopup = closeMapPopup;
window.updateCalculator = updateCalculator;
window.exportCalcICS = exportCalcICS;
window.printTourGuide = printTourGuide;
window.shareCalcResult = shareCalcResult;

// ============================================================
// FULLSCREEN IMAGE LIGHTBOX
// ============================================================
function openImageLightbox(src, title, caption) {
  const modal = document.getElementById('image-lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const capEl = document.getElementById('lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  img.alt = title || 'Thai Nguyen Photo';
  if (titleEl) titleEl.textContent = title || '';
  if (capEl) capEl.textContent = caption || '';

  const modalContainer = modal.querySelector('.relative.max-w-4xl') || modal.firstElementChild;
  if (modalContainer) {
    modalContainer.classList.remove('apple-modal-content');
    void modalContainer.offsetWidth;
    modalContainer.classList.add('apple-modal-content');
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeImageLightbox() {
  const modal = document.getElementById('image-lightbox-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

window.openImageLightbox = openImageLightbox;
window.closeImageLightbox = closeImageLightbox;

// ============================================================
// DYNAMIC HERO SCENE SWITCHER
// ============================================================
const HERO_SCENES = [
  {
    img: 'assets/images/hero-babe.jpg',
    badgeVi: 'Vườn Quốc Gia Ba Bể',
    badgeEn: 'Ba Be National Park',
    tagVi: 'Khu Bảo Tồn Ramsar Thế Giới Số 1938',
    tagEn: 'UNESCO Ramsar Wetland Site No. 1938',
    titleVi: 'Non Nước Hồ Ba Bể',
    titleEn: 'Pristine Waters of Ba Be Lake',
    descVi: 'Viên ngọc bích phẳng lặng giữa rừng núi đá vôi nguyên sinh phía Bắc.',
    descEn: 'A tranquil emerald jewel nestled within primeval karst limestone rainforests.',
    locVi: 'Hồ Ba Bể',
    locEn: 'Ba Be Lake',
    weatherVi: '🌤️ 22°C • Tiết trời se mát',
    weatherEn: '🌤️ 22°C • Crisp & Mild Breeze'
  },
  {
    img: 'assets/images/tan-cuong-tea.jpg',
    badgeVi: 'TP. Thái Nguyên',
    badgeEn: 'Thai Nguyen City',
    tagVi: 'Đệ Nhất Danh Trà Đất Việt',
    tagEn: 'Premier Tea Capital of Vietnam',
    titleVi: 'Nương Chè Bát Úp Tân Cương',
    titleEn: 'Tan Cuong Rolling Tea Terraces',
    descVi: 'Những thảm chè xanh mướt uốn lượn ngút ngàn, đượm hương cốm non sâu lắng.',
    descEn: 'Vast emerald tea blankets undulating under sunlight, carrying a sweet floral aroma.',
    locVi: 'Tân Cương',
    locEn: 'Tan Cuong',
    weatherVi: '☀️ 24°C • Nắng dịu trong lành',
    weatherEn: '☀️ 24°C • Pleasant & Sunny'
  },
  {
    img: 'assets/images/puong-cave.jpg',
    badgeVi: 'Vườn Quốc Gia Ba Bể',
    badgeEn: 'Ba Be National Park',
    tagVi: 'Hang Karst Sông Ngầm Kỳ Vĩ',
    tagEn: 'Subterranean Karst River Cave',
    titleVi: 'Động Puông Xuyên Dãy Lũng Nham',
    titleEn: 'Puong 300m Karst Cave Passage',
    descVi: 'Vòm đá vôi sừng sững cao 30m luồn qua dãy núi Lũng Nham cùng dòng sông Năng.',
    descEn: 'A towering 30-meter limestone arch cut through Lung Nham range by the Nang River.',
    locVi: 'Sông Năng',
    locEn: 'Nang River',
    weatherVi: '☁️ 20°C • Không khí mát lành',
    weatherEn: '☁️ 20°C • Refreshingly Cool'
  },
  {
    img: 'assets/images/cua-tu-stream.jpg',
    badgeVi: 'Huyện Đại Từ',
    badgeEn: 'Dai Tu District',
    tagVi: 'Hẻm Núi Thám Hiểm Hoang Sơ',
    tagEn: 'Wild Mountain Gorge & Cascades',
    titleVi: 'Hẻm Suối Cửa Tử Tam Đảo',
    titleEn: 'Cua Tu Canyon & Cascade',
    descVi: 'Dòng nước trong vắt, 7 cửa ải đá dựng đứng và máng trượt đá tự nhiên ngoạn mục.',
    descEn: 'Crystal-clear streams, seven rugged granite tiers, and thrilling natural slides.',
    locVi: 'Đại Từ',
    locEn: 'Dai Tu',
    weatherVi: '⛅ 23°C • Nước suối trong vắt',
    weatherEn: '⛅ 23°C • Crystal Clear Stream'
  }
];

let heroSceneIdx = 0;
let heroTimer = null;

function switchHeroScene(idx, event) {
  heroSceneIdx = idx % HERO_SCENES.length;
  const s = HERO_SCENES[heroSceneIdx];

  const imgEl   = document.getElementById('hero-main-img');
  const badgeEl = document.getElementById('hero-scene-badge');
  const tagEl   = document.getElementById('hero-scene-tag');
  const titleEl = document.getElementById('hero-scene-title');
  const descEl  = document.getElementById('hero-scene-desc');
  const locEl   = document.getElementById('hero-weather-loc');
  const valEl   = document.getElementById('hero-weather-val');

  if (imgEl) {
    let clickX = 50;
    let clickY = 50;
    if (event && event.clientX && event.clientY) {
      const rect = imgEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        clickX = Math.max(0, Math.min(100, Math.round(((event.clientX - rect.left) / rect.width) * 100)));
        clickY = Math.max(0, Math.min(100, Math.round(((event.clientY - rect.top) / rect.height) * 100)));
      }
    }
    imgEl.style.setProperty('--click-x', `${clickX}%`);
    imgEl.style.setProperty('--click-y', `${clickY}%`);

    imgEl.classList.remove('liquid-iris-active', 'ken-burns-active');
    imgEl.style.opacity = '0.35';
    setTimeout(() => {
      imgEl.src = s.img;
      void imgEl.offsetWidth;
      imgEl.style.opacity = '1';
      imgEl.classList.add('liquid-iris-active');
    }, 110);
  }

  const isEn = state.lang === 'en';
  if (badgeEl) badgeEl.textContent = isEn ? (s.badgeEn || s.badge) : (s.badgeVi || s.badge);
  if (tagEl)   tagEl.textContent   = isEn ? (s.tagEn || s.tag) : (s.tagVi || s.tag);
  if (titleEl) titleEl.textContent = isEn ? (s.titleEn || s.title) : (s.titleVi || s.title);
  if (descEl)  descEl.textContent  = isEn ? (s.descEn || s.desc) : (s.descVi || s.desc);
  if (locEl)   locEl.textContent   = isEn ? (s.locEn || s.loc) : (s.locVi || s.loc);
  if (valEl)   valEl.textContent   = isEn ? (s.weatherEn || s.weather) : (s.weatherVi || s.weather);

  document.querySelectorAll('.hero-thumb-btn').forEach(btn => {
    const bIdx = parseInt(btn.getAttribute('data-idx'));
    if (bIdx === heroSceneIdx) {
      btn.classList.add('active', 'border-emerald-600', 'scale-105');
      btn.classList.remove('border-slate-200');
    } else {
      btn.classList.remove('active', 'border-emerald-600', 'scale-105');
      btn.classList.add('border-slate-200');
    }
  });
}

function initHeroCarousel() {
  const container = document.getElementById('hero-carousel-container');
  if (!container) return;
  const initImg = document.getElementById('hero-main-img');
  if (initImg) initImg.classList.add('ken-burns-active');

  function start() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      switchHeroScene(heroSceneIdx + 1);
    }, 5500);
  }

  container.addEventListener('mouseenter', () => {
    if (heroTimer) clearInterval(heroTimer);
  });
  container.addEventListener('mouseleave', () => {
    start();
  });

  start();
}

// ============================================================
// GALLERY CATEGORY FILTER
// ============================================================
function filterGallery(cat) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const itemCat = item.getAttribute('data-gallery-cat');
    if (cat === 'all' || itemCat === cat) {
      item.classList.remove('hidden-item');
    } else {
      item.classList.add('hidden-item');
    }
  });

  document.querySelectorAll('.gallery-tab-btn').forEach(btn => {
    const onclickStr = btn.getAttribute('onclick') || '';
    if (onclickStr.includes("'" + cat + "'")) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  if (typeof initScrollReveal === 'function') setTimeout(initScrollReveal, 40);
}

// ============================================================
// MUST-DO BUCKET LIST CHECKLIST
// ============================================================
let bucketListState = JSON.parse(localStorage.getItem('tn_bucket_list') || '{}');

function initBucketList() {
  document.querySelectorAll('.bucket-checkbox').forEach(cb => {
    const id = cb.getAttribute('data-id');
    if (bucketListState[id]) {
      cb.checked = true;
    }
  });
  updateBucketUI();
}

function toggleBucketItem(id) {
  const cb = document.querySelector(`.bucket-checkbox[data-id="${id}"]`);
  if (!cb) return;

  if (cb.checked) {
    bucketListState[id] = true;
    showToast('Đã thêm vào danh sách trải nghiệm của bạn!');
  } else {
    delete bucketListState[id];
  }

  localStorage.setItem('tn_bucket_list', JSON.stringify(bucketListState));
  updateBucketUI();
}

function updateBucketUI() {
  const total = 5;
  const count = Object.keys(bucketListState).length;
  const pct = Math.round((count / total) * 100);

  const pctEl = document.getElementById('bucket-pct');
  const barEl = document.getElementById('bucket-progress-bar');
  const feedbackEl = document.getElementById('bucket-feedback');

  if (pctEl) pctEl.textContent = pct + '%';
  if (barEl) barEl.style.width = pct + '%';
  if (feedbackEl) {
    if (count === 0) feedbackEl.textContent = 'Đã chọn 0 / 5 trải nghiệm (Hãy chọn các điểm bạn muốn thử)';
    else if (count < 3) feedbackEl.textContent = `Đã chọn ${count} / ${total} trải nghiệm — Khởi đầu tuyệt vời!`;
    else if (count < 5) feedbackEl.textContent = `Đã chọn ${count} / ${total} trải nghiệm — Kế hoạch rất phong phú!`;
    else feedbackEl.textContent = '🎉 100% Hoàn hảo! Bạn đã sẵn sàng cho chuyến đi tuyệt nhất năm 2026!';
  }
}

// Global window assignments
window.switchHeroScene = switchHeroScene;
window.filterGallery = filterGallery;
window.toggleBucketItem = toggleBucketItem;

window.setMapLayer = setMapLayer;
window.locateUserPosition = locateUserPosition;
window.resetMapView = resetMapView;

// ============================================================
// APPLE-GRADE SCROLL REVEAL SYSTEM
// ============================================================
function initScrollReveal() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('section, .travel-card, .gallery-item, #bucket-list, #interactive-map, #tour-calculator').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const targets = document.querySelectorAll(
    'section, .travel-card, .gallery-item, #bucket-list, #interactive-map, #tour-calculator, .weather-pill-pulse'
  );

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
      if (el.parentElement && el.parentElement.classList.contains('grid')) {
        const siblingIdx = Array.from(el.parentElement.children).indexOf(el);
        if (siblingIdx >= 0 && siblingIdx < 4) {
          el.classList.add(`stagger-${(siblingIdx % 4) + 1}`);
        }
      }
      observer.observe(el);
    }
  });
}

// ============================================================
// APPLE NUMBER COUNTER ANIMATION (Smooth requestAnimationFrame)
// ============================================================
function initNumberCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        obs.unobserve(el);
        animateCounter(el);
      }
    });
  }, { threshold: 0.15 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target') || '0');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0');
  const isThousand = el.getAttribute('data-thousand') === 'true';
  const duration = 1600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentVal = target * easeOut;

    let formatted = '';
    if (isThousand) {
      formatted = Math.round(currentVal).toLocaleString('vi-VN');
    } else if (decimals > 0) {
      formatted = currentVal.toFixed(decimals).replace('.', ',');
    } else {
      formatted = Math.round(currentVal).toString();
    }

    el.textContent = `${prefix}${formatted}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      let finalStr = '';
      if (isThousand) {
        finalStr = Math.round(target).toLocaleString('vi-VN');
      } else if (decimals > 0) {
        finalStr = target.toFixed(decimals).replace('.', ',');
      } else {
        finalStr = Math.round(target).toString();
      }
      el.textContent = `${prefix}${finalStr}${suffix}`;
    }
  }

  requestAnimationFrame(update);
}

window.initScrollReveal = initScrollReveal;
window.initNumberCounters = initNumberCounters;

// ============================================================
// LIVE SEARCH FLYOUT DROPDOWN (Bilingual & Diacritic-Insensitive)
// ============================================================
function removeDiacritics(str) {
  return (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function initLiveSearch() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  function performSearch() {
    const rawQ = input.value.trim();
    if (!rawQ || rawQ.length < 2) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }

    const q = rawQ.toLowerCase();
    const qNorm = removeDiacritics(q);

    const matchedDest = (typeof DESTINATIONS !== 'undefined' ? DESTINATIONS : []).filter(d => {
      const hayVi = (d.nameVi + ' ' + d.tagVi + ' ' + d.districtVi).toLowerCase();
      const hayEn = (d.nameEn + ' ' + d.tagEn + ' ' + d.districtEn).toLowerCase();
      const hayNorm = removeDiacritics(hayVi);
      return hayVi.includes(q) || hayEn.includes(q) || hayNorm.includes(qNorm);
    });

    const matchedPagodas = (typeof PAGODAS !== 'undefined' ? PAGODAS : []).filter(p => {
      const hayVi = (p.nameVi + ' ' + p.districtVi).toLowerCase();
      const hayEn = (p.nameEn + ' ' + p.districtEn).toLowerCase();
      const hayNorm = removeDiacritics(hayVi);
      return hayVi.includes(q) || hayEn.includes(q) || hayNorm.includes(qNorm);
    });

    const allMatches = [
      ...matchedDest.map(d => ({
        id: d.id,
        name: state.lang === 'vi' ? d.nameVi : d.nameEn,
        tag: state.lang === 'vi' ? d.tagVi : d.tagEn,
        image: d.image
      })),
      ...matchedPagodas.map(p => ({
        id: p.id,
        name: state.lang === 'vi' ? p.nameVi : p.nameEn,
        tag: state.lang === 'vi' ? p.tagVi : p.tagEn,
        image: p.image
      }))
    ].slice(0, 5);

    if (allMatches.length === 0) {
      dropdown.innerHTML = `
        <div class="p-3.5 text-center text-xs text-slate-500 font-sans">
          ${state.lang === 'en' ? 'No quick matches. Click "Explore" for all.' : 'Không có gợi ý nhanh. Bấm "Khám phá" để xem toàn bộ.'}
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = allMatches.map(m => `
      <div onclick="openDestinationModal('${m.id}'); document.getElementById('search-dropdown').classList.add('hidden');" 
           class="p-3 hover:bg-emerald-50/80 cursor-pointer flex items-center justify-between gap-3 transition">
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${m.image}" alt="${m.name}" class="w-10 h-10 rounded-xl object-cover shrink-0 shadow-2xs">
          <div class="truncate">
            <div class="text-xs font-bold text-slate-900 truncate">${m.name}</div>
            <div class="text-[10px] text-emerald-800 font-mono truncate">${m.tag}</div>
          </div>
        </div>
        <span class="text-xs font-bold text-slate-400 group-hover:text-emerald-700 font-mono shrink-0">&rarr;</span>
      </div>
    `).join('') + `
      <div class="p-2.5 bg-slate-50/90 text-center border-t border-slate-100">
        <a href="#landscapes" onclick="document.getElementById('search-dropdown').classList.add('hidden');" class="text-xs font-bold text-emerald-800 hover:text-emerald-900 transition">
          ${state.lang === 'en' ? 'View all destinations in catalog &darr;' : 'Xem tất cả điểm đến trong danh mục &darr;'}
        </a>
      </div>
    `;

    dropdown.classList.remove('hidden');
  }

  input.addEventListener('input', performSearch);
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) performSearch();
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
    }
  });
}

// ============================================================
// MAP FULLSCREEN CONTROLLER
// ============================================================
function toggleMapFullscreen() {
  const mapSec = document.getElementById('interactive-map');
  if (!mapSec) return;
  if (!document.fullscreenElement) {
    if (mapSec.requestFullscreen) {
      mapSec.requestFullscreen();
    } else if (mapSec.webkitRequestFullscreen) {
      mapSec.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

document.addEventListener('fullscreenchange', handleMapFullscreenResize);
document.addEventListener('webkitfullscreenchange', handleMapFullscreenResize);

function handleMapFullscreenResize() {
  const mapEl = document.getElementById('tn-map');
  const btn = document.getElementById('btn-map-fullscreen');
  if (document.fullscreenElement) {
    if (mapEl) mapEl.style.height = 'calc(100vh - 130px)';
    if (btn) btn.innerHTML = '<span>❌</span><span class="hidden sm:inline">Thu nhỏ</span>';
  } else {
    if (mapEl) mapEl.style.height = '560px';
    if (btn) btn.innerHTML = '<svg class="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg><span class="hidden sm:inline">Toàn màn hình</span>';
  }
  if (typeof tnMap !== 'undefined' && tnMap) {
    setTimeout(() => tnMap.invalidateSize(), 300);
  }
}

// Global window assignments
window.initLiveSearch = initLiveSearch;
window.toggleMapFullscreen = toggleMapFullscreen;
window.clearAllSavedPlaces = clearAllSavedPlaces;
window.openSavedModal = openSavedModal;
window.closeSavedModal = closeSavedModal;

// ============================================================
// MOTIONSITES AI: CURSOR SPOTLIGHT & 3D PERSPECTIVE CARDS
// ============================================================
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card, .travel-card');
  cards.forEach(card => {
    if (!card.classList.contains('spotlight-card')) {
      card.classList.add('spotlight-card');
    }
    // Remove duplicate listeners if already attached
    if (!card.dataset.spotlightBound) {
      card.dataset.spotlightBound = 'true';
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-500px`);
        card.style.setProperty('--mouse-y', `-500px`);
      });
    }
  });
}

function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card-3d');
  tiltCards.forEach(card => {
    if (!card.dataset.tiltBound) {
      card.dataset.tiltBound = 'true';
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5.5;
        const rotateY = ((x - centerX) / centerX) * 5.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    }
  });
}

window.initSpotlightCards = initSpotlightCards;
window.init3DCardTilt = init3DCardTilt;

// ============================================================
// INTERACTIVE TIME-LAPSE SPLIT-SCREEN CURTAIN (Sương Mai & Hoàng Hôn)
// ============================================================
function initTimeLapseCurtain() {
  const container = document.getElementById('timelapse-container');
  const clipLayer = document.getElementById('timelapse-clip-layer');
  const leftImg = document.getElementById('timelapse-img-left');
  const handle = document.getElementById('timelapse-handle');
  if (!container || !clipLayer || !leftImg || !handle) return;

  function syncWidth() {
    leftImg.style.width = container.offsetWidth + 'px';
  }
  syncWidth();
  window.addEventListener('resize', syncWidth);

  let isDragging = false;

  function setPosition(clientX) {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    pct = Math.max(3, Math.min(97, pct));
    clipLayer.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  container.addEventListener('mousedown', e => {
    isDragging = true;
    setPosition(e.clientX);
  });
  window.addEventListener('mousemove', e => {
    if (isDragging) {
      setPosition(e.clientX);
    }
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  container.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }
  }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (isDragging && e.touches.length > 0) {
      setPosition(e.touches[0].clientX);
    }
  }, { passive: true });
  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Hover auto glide when mouse moves across container
  container.addEventListener('mousemove', e => {
    if (!isDragging) {
      setPosition(e.clientX);
    }
  });
}

// ============================================================
// CINEMATIC 4K THEATER MODE
// ============================================================
const CINEMA_SCENES = [
  {
    titleVi: 'Hồ Ba Bể • Viên Ngọc Bích Giữa Đại Ngàn',
    titleEn: 'Ba Be Lake • The Pristine Emerald Karst Jewel',
    img: 'assets/images/hero-babe.jpg',
    glow: 'rgba(16, 185, 129, 0.3)',
    quoteVi: '"Giữa thung lũng đá vôi ngàn mét, mặt nước ngọc bích phẳng lặng như một tấm gương soi cả bầu trời Đông Bắc."',
    quoteEn: '"Sheltered by towering thousand-meter karst karsts, the jade-green waters mirror the northeastern sky."'
  },
  {
    titleVi: 'Đồi Chè Tân Cương • Sắc Xanh Nương Bát Úp',
    titleEn: 'Tan Cuong Tea Terraces • Rolling Emerald Blankets',
    img: 'assets/images/tan-cuong-tea.jpg',
    glow: 'rgba(217, 119, 6, 0.3)',
    quoteVi: '"Từng búp chè một tôm hai lá đón sương sớm, thơm lừng hương cốm non đượm sâu vị ngọt hậu đất trời."',
    quoteEn: '"Tender young tea shoots bathed in morning dew, exuding a sweet floral scent with a rich honeyed finish."'
  },
  {
    titleVi: 'Động Puông • Hang Sông Ngầm Karst 300m',
    titleEn: 'Puong Cave • 300m Subterranean River Arch',
    img: 'assets/images/puong-cave.jpg',
    glow: 'rgba(6, 182, 212, 0.3)',
    quoteVi: '"Dòng sông Năng cuồn cuộn chảy xuyên lòng núi Lũng Nham, vòm hang đá vôi sừng sững cao 30m kỳ vĩ."',
    quoteEn: '"The Nang River flows powerfully through the heart of Lung Nham mountain beneath a majestic 30-meter limestone arch."'
  },
  {
    titleVi: 'Suối Cửa Tử • 7 Cửa Ải Thác Đổ Tam Đảo',
    titleEn: 'Cua Tu Stream • 7 Rugged Cascades of Tam Dao',
    img: 'assets/images/cua-tu-stream.jpg',
    glow: 'rgba(168, 85, 247, 0.3)',
    quoteVi: '"Dòng nước trong vắt luồn qua vách đá dựng đứng, nơi thiên nhiên ban tặng những máng trượt đá tự nhiên kỳ thú."',
    quoteEn: '"Crystal-clear mountain currents carve through vertical cliffs, creating spectacular natural granite waterslides."'
  }
];

let cinemaIdx = 0;

function openCinemaModal() {
  const modal = document.getElementById('cinema-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  switchCinemaScene(heroSceneIdx || 0);

  if (typeof startAudioSynthesizer === 'function' && !state.soundPlaying) {
    startAudioSynthesizer();
  }
}

function closeCinemaModal() {
  const modal = document.getElementById('cinema-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function switchCinemaScene(idx) {
  cinemaIdx = idx % CINEMA_SCENES.length;
  const s = CINEMA_SCENES[cinemaIdx];

  const titleEl = document.getElementById('cinema-title');
  const imgEl   = document.getElementById('cinema-screen-img');
  const glowEl  = document.getElementById('cinema-ambient-glow');
  const capEl   = document.getElementById('cinema-caption');

  const isEn = state.lang === 'en';
  if (titleEl) titleEl.textContent = isEn ? (s.titleEn || s.title) : (s.titleVi || s.title);
  if (glowEl) glowEl.style.backgroundColor = s.glow;
  if (capEl) capEl.textContent = isEn ? (s.quoteEn || s.quote) : (s.quoteVi || s.quote);

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = s.img;
      void imgEl.offsetWidth;
      imgEl.style.opacity = '1';
      imgEl.classList.remove('liquid-iris-active');
      void imgEl.offsetWidth;
      imgEl.classList.add('liquid-iris-active');
    }, 110);
  }

  document.querySelectorAll('.cinema-nav-btn').forEach(btn => {
    const bIdx = parseInt(btn.getAttribute('data-cidx'));
    if (bIdx === cinemaIdx) {
      btn.classList.add('active', 'border-emerald-500/80', 'bg-white/15', 'text-white');
      btn.classList.remove('border-white/10', 'bg-white/5', 'text-slate-400');
    } else {
      btn.classList.remove('active', 'border-emerald-500/80', 'bg-white/15', 'text-white');
      btn.classList.add('border-white/10', 'bg-white/5', 'text-slate-400');
    }
  });
}

window.initTimeLapseCurtain = initTimeLapseCurtain;
window.openCinemaModal = openCinemaModal;
window.closeCinemaModal = closeCinemaModal;
window.switchCinemaScene = switchCinemaScene;

// ============================================================
// CINEMATIC BACKGROUND VIDEO CONTROLLER
// ============================================================
function toggleHeroVideo() {
  const video = document.getElementById('hero-bg-video');
  const icon = document.getElementById('video-status-icon');
  const text = document.getElementById('video-status-text');
  if (!video) return;

  if (video.paused) {
    video.play().then(() => {
      if (icon) icon.textContent = '⏸️';
      if (text) text.textContent = 'Tạm dừng video';
      showToast('Đang phát video nền thiên nhiên');
    }).catch(err => console.warn(err));
  } else {
    video.pause();
    if (icon) icon.textContent = '▶️';
    if (text) text.textContent = 'Phát video';
    showToast('Đã tạm dừng video nền');
  }
}

window.toggleHeroVideo = toggleHeroVideo;

// ============================================================
// 3D PICTURE FRAMES ENGINE (9 KỲ QUAN ĐẠI NGÀN)
// ============================================================
function init3DFrameCards() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrappers = document.querySelectorAll('.frame-3d-wrapper');
  wrappers.forEach(wrap => {
    const card = wrap.querySelector('.frame-3d-card');
    if (!card) return;
    if (wrap.dataset.frame3dBound) return;
    wrap.dataset.frame3dBound = 'true';

    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate realistic 3D tilt
      const rotateX = ((y - centerY) / centerY) * -10.5;
      const rotateY = ((x - centerX) / centerX) * 10.5;

      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    wrap.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

window.init3DFrameCards = init3DFrameCards;


// ============================================================
// 24/7 VISITOR SUPPORT HUB
// ============================================================
function openSupportModal() {
  const modal = document.getElementById('support-modal');
  const panel = document.getElementById('support-drawer-panel');
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (panel) {
    setTimeout(() => {
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
    }, 20);
  }
}

function closeSupportModal() {
  const modal = document.getElementById('support-modal');
  const panel = document.getElementById('support-drawer-panel');
  if (!modal) return;

  if (panel) {
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
  }
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 280);
}

function submitSupportForm(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('support-input-name');
  const phoneInput = document.getElementById('support-input-phone');
  const msgInput = document.getElementById('support-input-msg');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name || !phone) {
    showToast(state.lang === 'vi' ? 'Vui lòng nhập Họ tên và Số điện thoại!' : 'Please enter your Full Name and Phone number!');
    return;
  }

  showToast(state.lang === 'vi'
    ? `Cảm ơn ${name}! Tổng đài Du lịch Thái Nguyên đã nhận thông tin và sẽ gọi lại trong 10 phút.`
    : `Thank you ${name}! Our Thai Nguyen Tourism Support team will call you back within 10 minutes.`);

  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (msgInput) msgInput.value = '';

  setTimeout(() => {
    closeSupportModal();
  }, 1600);
}

window.openSupportModal = openSupportModal;
window.closeSupportModal = closeSupportModal;
window.submitSupportForm = submitSupportForm;
