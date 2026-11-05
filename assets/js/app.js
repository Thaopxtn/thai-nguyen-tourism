/**
 * Thai Nguyen Tourism - Professional UI/UX Application Engine
 * Developed according to UI/UX Pro Max Guidelines (Inspired by Airbnb & Lonely Planet)
 * Clean hierarchy, Lucide SVG icons, zero clutter, accessible & responsive.
 */

// --- GLOBAL APPLICATION STATE ---
const state = {
  lang: localStorage.getItem('tn_lang') || 'en',
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
    titleEn: 'The New Thai Nguyen Province (Resolution 202/2025/QH15)',
    titleVi: 'Tỉnh Thái Nguyên Mới Sau Sáp Nhập (NQ 202/2025/QH15)',
    badgeEn: 'The New Era',
    badgeVi: 'Kỷ Nguyên Mới',
    descEn: 'Under Resolution No. 202/2025/QH15 of the National Assembly, Thai Nguyen and Bac Kan officially reunited on July 1, 2025 into the new Thai Nguyen Province with 8,375 km² and 92 commune-level units. Combining southern industrial might with northern Ba Be ecotourism.',
    descVi: 'Theo Nghị quyết số 202/2025/QH15 của Quốc hội, Thái Nguyên và Bắc Kạn chính thức sáp nhập trở lại thành tỉnh Thái Nguyên mới từ ngày 01/07/2025 với 8.375 km² và 92 xã, phường. Kết hợp hoàn mỹ công nghiệp phía Nam với sinh thái Ba Bể phía Bắc.',
    factsEn: ['8,375 km² Total Area', '92 Commune-Level Units', '8 Million Tourists Target in 2026'],
    factsVi: ['Diện tích 8.375 km² (92 xã, phường)', 'Quy mô dân số 1,87 triệu người', 'Mục tiêu đón 8 triệu lượt khách năm 2026']
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
    rainfall: 'Light drizzle (Mưa xuân lất phất)',
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
});

// --- TRANSLATION / BILINGUAL ENGINE ---
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('tn_lang', lang);

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = state.lang === 'vi' ? el.getAttribute('data-vi') : el.getAttribute('data-en');
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  renderDestinations();
  renderEpochTimeline(state.activeEpoch);
  renderSeasons(state.activeSeason);
  renderPagodas();
  renderHospitals();
  renderSavedPlacesList();

  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = state.lang === 'en'
      ? '<span class="text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">EN</span> <span class="text-xs text-slate-500 font-medium px-1">VI</span>'
      : '<span class="text-xs text-slate-500 font-medium px-1">EN</span> <span class="text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded">VI</span>';
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

  container.innerHTML = filtered.map(item => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;
    const district = state.lang === 'vi' ? item.districtVi : item.districtEn;
    const season = state.lang === 'vi' ? item.idealSeasonVi : item.idealSeasonEn;
    const isSaved = state.savedPlaces.some(p => p.id === item.id);

    return `
      <article class="travel-card flex flex-col justify-between group overflow-hidden">
        <div>
          <!-- Clean Photo Aspect Container -->
          <div class="travel-photo-container aspect-[16/10] relative">
            <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
            
            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              ${tag}
            </span>

            <button onclick="toggleSavePlace('${item.id}', event)" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-red-500 transition shadow-sm" title="Save Place">
              <svg class="w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>

          <!-- Body Content -->
          <div class="p-5">
            <div class="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold mb-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${district}</span>
            </div>

            <h3 class="text-xl font-travel-heading font-bold text-slate-900 group-hover:text-emerald-800 transition tracking-tight mb-2">
              ${name}
            </h3>

            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal mb-4">
              ${desc}
            </p>

            <div class="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span><strong>${state.lang === 'en' ? 'Best Season:' : 'Mùa lý tưởng:'}</strong> ${season}</span>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="p-5 pt-0">
          <button onclick="openDestinationModal('${item.id}')" class="w-full py-2.5 px-4 bg-slate-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 shadow-sm">
            <span>${state.lang === 'en' ? 'View Guide & Details' : 'Xem chi tiết & Hướng dẫn'}</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
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
            ? 'Nghị quyết số 202/2025/QH15 mở ra diện mạo mới cho tỉnh Thái Nguyên với 8.375 km², kết hợp hoàn hảo đô thị công nghiệp phía Nam và sinh thái Ba Bể phía Bắc.' 
            : 'Vùng đất giàu truyền thống yêu nước, căn cứ địa cách mạng trung kiên bảo vệ độc lập dân tộc qua các thời kỳ.'}
        </p>
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Nguồn: thainguyen.gov.vn</span>
          <span class="font-bold text-emerald-800">Cổng Thông Tin Tỉnh</span>
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
            <button onclick="toggleSavePlace('${item.id}', event)" class="shrink-0 px-4 py-2 border border-slate-300 text-slate-800 hover:bg-slate-50 rounded-xl transition font-semibold">
              ${state.savedPlaces.some(p => p.id === item.id)
                ? (state.lang === 'en' ? '✓ Saved' : '✓ Đã lưu')
                : (state.lang === 'en' ? '+ Bookmark' : '+ Lưu vào hành trình')}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
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
        <button onclick="toggleSavePlace('${item.id}'); openDestinationModal('${item.id}');" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border ${isSaved ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} text-xs font-semibold flex items-center justify-center gap-2 transition">
          <svg class="w-4 h-4 ${isSaved ? 'fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span>${isSaved ? (state.lang === 'en' ? 'Remove from Saved' : 'Bỏ lưu khỏi danh sách') : (state.lang === 'en' ? 'Save Destination' : 'Lưu điểm đến này')}</span>
        </button>

        <a href="#itinerary-builder" onclick="closeDestinationModal()" class="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition text-center shadow-sm">
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
  if (modal) {
    renderSavedPlacesList();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeSavedModal() {
  const modal = document.getElementById('saved-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
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

    const topBtn = document.getElementById('back-to-top');
    if (topBtn) {
      if (winScroll > 400) {
        topBtn.classList.remove('opacity-0', 'pointer-events-none');
        topBtn.classList.add('opacity-100');
      } else {
        topBtn.classList.add('opacity-0', 'pointer-events-none');
        topBtn.classList.remove('opacity-100');
      }
    }
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
