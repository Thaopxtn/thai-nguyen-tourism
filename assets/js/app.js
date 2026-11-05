/**
 * Thai Nguyen Tourism - Editorial & Cultural Heritage Application Script
 * Real-world localized assets, authentic field research notes,
 * bilingual engine, and Web Audio acoustic nature synthesizer.
 */

// --- GLOBAL APPLICATION STATE ---
const state = {
  lang: localStorage.getItem('tn_lang') || 'en',
  activeFilter: 'all',
  activeSeason: 'spring',
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
    nameEn: 'Ba Be Lake (Three Connected Lakes)',
    nameVi: 'Hồ Ba Bể (Slam Pé)',
    tagEn: 'Ramsar Wetland & Karst Jewel',
    tagVi: 'Kỳ quan Đầm lầy Ramsar & Viên Ngọc Bích',
    locationEn: 'Ba Be National Park, Northern Region',
    locationVi: 'Vườn Quốc gia Ba Bể, Phía Bắc Thái Nguyên',
    elevation: '150m MSL • 22°24′N 105°36′E',
    image: 'assets/images/babe-lake.jpg',
    realPhotoCredit: 'Ảnh thực tế: Vườn Quốc gia Ba Bể (Wikimedia Commons)',
    featured: true,
    descEn: 'One of the world\'s 20 special freshwater karst lakes, Ba Be ("Slam Pé" in the Tay language) unites three interconnected basins: Pé Lèng, Pé Lù, and Pé Làm. Sheltered by 1,000-meter sheer limestone pinnacles and evergreen primeval canopies, the crystal jade waters mirror the sky year-round. Travelers glide on traditional wooden dugouts, inhale crisp mountain oxygen, and discover centuries-old Tay stilt hamlets.',
    descVi: 'Một trong 20 hồ nước ngọt karst tự nhiên đặc biệt của thế giới cần được bảo vệ, Ba Bể (tiếng Tày gọi là "Slam Pé") hợp lưu từ ba phân hồ: Pé Lèng, Pé Lù và Pé Làm. Được che chắn bởi những vách núi đá vôi ngàn mét và rừng nguyên sinh rậm rạp, mặt nước xanh biếc phản chiếu mây trời quanh năm tĩnh lặng. Du khách được lướt trên thuyền độc mộc, tận hưởng bầu không khí đại ngàn trong lành và khám phá bản sắc Tày cổ xưa.',
    highlightsEn: ['Three connected lake basins (Pé Lèng, Pé Lù, Pé Làm)', 'An Ma Island & Widow Island (Gò Bà Góa)', 'Pac Ngoi & Bo Lu traditional stilt hamlets', 'Freshwater carp & mountain bamboo delicacies'],
    highlightsVi: ['3 vịnh hồ tự nhiên thông nhau (Pé Lèng, Pé Lù, Pé Làm)', 'Đảo An Mạ linh thiêng & Gò Bà Góa huyền thoại', 'Bản nhà sàn Pác Ngòi và Bó Lù mộc mạc', 'Cá hồ nướng than hoa & rau dớn rừng đại ngàn'],
    idealSeasonEn: 'Summer & Autumn (May – November)',
    idealSeasonVi: 'Mùa hè & Mùa thu (Tháng 5 – 11)',
    author: 'Thu'
  },
  {
    id: 'tan-cuong-tea-hills',
    category: 'tea',
    nameEn: 'Tan Cuong Tea Terraces',
    nameVi: 'Nương Chè Mâm Xôi Tân Cương',
    tagEn: 'The Tea Cradle of Vietnam',
    tagVi: 'Đệ Nhất Danh Trà Đất Việt',
    locationEn: 'Tan Cuong Basin, Thai Nguyen City',
    locationVi: 'Vùng chè Tân Cương, TP. Thái Nguyên',
    elevation: '75m MSL • 21°32′N 105°45′E',
    image: 'assets/images/tan-cuong-tea.jpg',
    realPhotoCredit: 'Ảnh thực tế: Đồi chè Tân Cương (Wikimedia Commons)',
    featured: true,
    descEn: 'The undisputed soul of Thai Nguyen\'s agricultural identity, spanning over 22,268 hectares of tea across the province. In Tan Cuong, rolling emerald hills shaped like inverted bowls ("đồi chè bát úp") stretch to the horizon. Here, skilled tea masters harvest delicate "one bud, two leaves" shoots at dawn and roast them in cast-iron pans, producing an amber brew with a fragrant young-rice aroma and honeyed aftertaste.',
    descVi: 'Linh hồn bất tận của xứ sở chè Việt Nam với hơn 22.268 ha nương chè xanh mướt toàn tỉnh. Tại Tân Cương, những quả đồi thoai thoải hình bát úp, mâm xôi uốn lượn nối tiếp nhau tới tận chân trời. Nơi đây, các nghệ nhân thu hái búp chè "một tôm hai lá" lúc sương mai còn đọng và sao chè thủ công trên chảo gang, tạo nên chén trà màu nước sánh vàng như mật ong, thơm mùi cốm non và ngọt hậu sâu lắng.',
    highlightsEn: ['Endless conical tea mounds ("đồi chè bát úp")', 'Artisan wood-fired pan-roasting workshops', 'Imperial tea tasting masterclasses with masters', 'Eco-homestays amidst tea gardens'],
    highlightsVi: ['Nương chè bát úp, mâm xôi ngút ngàn', 'Nghệ thuật sao suốt thủ công trên chảo gang', 'Thưởng trà cung đình và tìm hiểu trà đạo', 'Homestay sinh thái giữa không gian đồi chè'],
    idealSeasonEn: 'Year-round (Best: Spring & Autumn)',
    idealSeasonVi: 'Bốn mùa (Đẹp nhất: Mùa Xuân & Mùa Thu)',
    author: 'Thu'
  },
  {
    id: 'puong-cave',
    category: 'cave',
    nameEn: 'Puong Cave (Nang River Tunnel)',
    nameVi: 'Động Puông (Sông Năng Xuyên Sơn)',
    tagEn: '300m Karst Mountain Cavern',
    tagVi: 'Kỳ Quan Sông Ngầm Dãy Lũng Nham',
    locationEn: 'Lung Nham Range, Nang River Basin',
    locationVi: 'Dãy Lũng Nham, Sông Năng, Ba Bể',
    elevation: '135m MSL • 22°27′N 105°41′E',
    image: 'assets/images/puong-cave.jpg',
    realPhotoCredit: 'Ảnh thực tế: Thuyền qua Động Puông (Wikimedia Commons)',
    featured: false,
    descEn: 'A breathtaking geological passage where the rushing turquoise waters of the Nang River bore directly through the limestone core of Lung Nham mountain. Travelers journey on motorized wooden boats through a 300-meter-long, 30-meter-high cavern corridor beneath colossal stalactites and tens of thousands of nesting fruit bats.',
    descVi: 'Tuyệt tác địa chất kỳ vĩ nơi dòng nước ngọc bích của sông Năng chảy xuyên thủng lòng dãy núi đá vôi Lũng Nham. Du khách ngồi thuyền máy luồn qua đường hầm karst tự nhiên dài 300m, vòm cao hơn 30m sừng sững dưới những nhũ đá kỳ dị và hàng vạn cá thể dơi tự nhiên ríu rít trên vòm trần.',
    highlightsEn: ['300-meter river boat voyage inside mountain', 'Tens of thousands of roosting mountain bats', 'Natural stone pillars & sunlight shafts'],
    highlightsVi: ['Du thuyền vượt sông ngầm xuyên lòng núi 300m', 'Hàng vạn chú dơi tự nhiên ríu rít trên vòm đá', 'Trụ thạch nhũ nghìn năm và luồng sáng kỳ ảo'],
    idealSeasonEn: 'Year-round (Dry in Autumn & Winter)',
    idealSeasonVi: 'Quanh năm (Khô thoáng vào Mùa Thu & Đông)',
    author: 'Thu'
  },
  {
    id: 'dau-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Dau Dang Roaring Rapids',
    nameVi: 'Thác Ghềnh Đầu Đẳng',
    tagEn: 'Untamed Primeval Waterfall',
    tagVi: 'Thác Rừng Nguyên Sinh Hùng Vĩ',
    locationEn: 'Nang River Border Gorge',
    locationVi: 'Hẻm sông Năng giáp ranh Ba Bể',
    elevation: '120m MSL • 22°28′N 105°33′E',
    image: 'assets/images/dau-dang-waterfall.jpg',
    realPhotoCredit: 'Ảnh thực tế: Thác Đầu Đẳng (Wikimedia Commons)',
    featured: false,
    descEn: 'Where the gentle Nang River crashes violently against hundreds of giant limestone boulders, cascading over a 500-meter staircase of roaring white water. Framed by primeval jungle and misty gorges, Dau Dang represents the raw wilderness of northern Vietnam and is home to the legendary giant "ca chien" fish.',
    descVi: 'Nơi dòng sông Năng hiền hòa bất ngờ gặp hàng trăm tảng đá vôi khổng lồ chặn lối, đổ dốc qua quãng dài hơn 500m tạo thành thác ghềnh gầm vang dội bọt tuyết trắng xóa. Giữa vách đá dựng đứng và rừng già rợp bóng, thác Đầu Đẳng là biểu tượng của thiên nhiên hoang sơ và môi trường sống của loài cá chiên quý hiếm.',
    highlightsEn: ['500m rocky cascades of surging foam', 'Primeval jungle walking trails', 'Spotting indigenous giant mountain fish'],
    highlightsVi: ['Dãy bậc ghềnh dài 500m tung bọt trắng xóa', 'Đường mòn xuyên rừng nguyên sinh phủ rêu', 'Thưởng thức đặc sản cá chiên sông Năng'],
    idealSeasonEn: 'May to October (Peak water volume)',
    idealSeasonVi: 'Tháng 5 – 10 (Mùa nước xiết ngoạn mục)',
    author: 'Thu'
  },
  {
    id: 'hua-ma-cave',
    category: 'cave',
    nameEn: 'Hua Ma Cave (Subterranean Palace)',
    nameVi: 'Động Hua Mạ (Hang Treo Núi Lèo Pèn)',
    tagEn: 'Spectacular Stalactite Cathedral',
    tagVi: 'Thánh Đường Nhũ Đá Hàng Triệu Năm',
    locationEn: 'Quang Khe, Leo Pen Mountain',
    locationVi: 'Xã Quảng Khê, Lưng chừng núi Lèo Pèn',
    elevation: '350m MSL • 22°22′N 105°42′E',
    image: 'assets/images/hua-ma-cave.jpg',
    realPhotoCredit: 'Ảnh thực tế: Lòng Động Hua Mạ (Wikimedia Commons)',
    featured: false,
    descEn: 'Resting halfway up the forested slope of Leo Pen mountain, Hua Ma reveals a dry cave chamber stretching 700 meters deep with ceilings soaring up to 50 meters. Thousands of stalactites and stalagmites have evolved into natural stone lotuses, royal thrones, and Bodhisattva figurines over eons.',
    descVi: 'Tọa lạc ở lưng chừng sườn núi rậm rạp Lèo Pèn, động Hua Mạ mở ra vòm hang khô sâu hơn 700m với trần hang cao tới 50m lộng lẫy. Hàng ngàn khối thạch nhũ và măng đá qua hàng triệu năm đã hóa thành các tòa sen đá, ngai vàng, cột chống trời và tượng Bồ Tát thanh tịnh.',
    highlightsEn: ['700-meter deep cathedral chamber', 'Natural stone lotus & curtain formations', 'Cool 18°C subterranean microclimate'],
    highlightsVi: ['Lòng hang sâu 700m rộng lớn như giáo đường', 'Thạch nhũ hình tòa sen và rèm châu tự nhiên', 'Nhiệt độ trong hang mát rượi 18°C quanh năm'],
    idealSeasonEn: 'All seasons (Always dry inside)',
    idealSeasonVi: 'Bốn mùa (Lòng hang luôn khô ráo)',
    author: 'Thu'
  },
  {
    id: 'phuong-hoang-moga',
    category: 'cave',
    nameEn: 'Phuong Hoang Cave & Mo Ga Stream',
    nameVi: 'Hang Phượng Hoàng & Suối Mỏ Gà',
    tagEn: 'Vo Nhai Mountain Wonder',
    tagVi: 'Kỳ Quan Hang Núi & Suối Nguồn Võ Nhai',
    locationEn: 'Phu Thuong, Vo Nhai District',
    locationVi: 'Xã Phú Thượng, Huyện Võ Nhai',
    elevation: '420m MSL • 21°45′N 106°01′E',
    image: 'assets/images/phuong-hoang-moga.jpg',
    realPhotoCredit: 'Ảnh tư liệu: Cục Du lịch Quốc gia Việt Nam',
    featured: false,
    descEn: 'A magnificent twin landmark in eastern Thai Nguyen. High above lies Phuong Hoang Cave, filled with sparkling stalactites including a giant pair of petrified phoenix wings. At the mountain foot, Mo Ga stream emerges from a natural rock fissure with icy-clear drinking-pure spring water and natural wading pools.',
    descVi: 'Tuyệt tác thiên nhiên kết hợp hoàn mỹ tại huyện vùng cao Võ Nhai. Trên đỉnh núi là hang Phượng Hoàng kỳ ảo với nhũ đá hình đôi chim phượng hoàng dang cánh; dưới chân núi là suối Mỏ Gà tuôn trào từ lòng đá ngầm mát lạnh trong veo, nơi du khách đắm mình trong làn nước thanh khiết.',
    highlightsEn: ['Twin phoenix stalactite sculpture', 'Natural icy wading pools at stream foot', 'Refreshing summer swimming haven'],
    highlightsVi: ['Nhũ đá đôi chim Phượng Hoàng dang cánh', 'Bể bơi tự nhiên suối Mỏ Gà mát lạnh 16-18°C', 'Chinh phục 1.200 bậc đá ngắm toàn cảnh thung lũng'],
    idealSeasonEn: 'May to October (Best for cooling off)',
    idealSeasonVi: 'Tháng 5 – 10 (Lý tưởng để tắm mát)',
    author: 'Thu'
  },
  {
    id: 'cua-tu-stream',
    category: 'trekking',
    nameEn: 'Cua Tu Stream (Tam Dao Foothills)',
    nameVi: 'Suối Cửa Tử (Chân Núi Tam Đảo)',
    tagEn: '7-Canyon Adventure Trek',
    tagVi: 'Thiên Đường Trekking 7 Hẻm Núi',
    locationEn: 'Hoang Nong, Dai Tu District',
    locationVi: 'Xã Hoàng Nông, Huyện Đại Từ',
    elevation: '280m MSL • 21°38′N 105°37′E',
    image: 'assets/images/cua-tu-stream.jpg',
    realPhotoCredit: 'Ảnh thực tế: Suối rừng tự nhiên Đại Từ (Wikimedia Commons)',
    featured: false,
    descEn: 'Nestled along the eastern slopes of the mist-clad Tam Dao mountain range, Cua Tu is a dreamland for intrepid hikers. The stream winds through seven formidable "doors" (rocky gates), deep emerald plunge pools, natural stone slides, and mossy canyon passages fed by virgin rainforest.',
    descVi: 'Nép mình bên sườn đông dãy núi Tam Đảo mù sương, suối Cửa Tử là thiên đường cho những bước chân đam mê khám phá mạo hiểm. Dòng suối uốn lượn vượt qua 7 "cửa" ải thác ghềnh dựng đứng, những máng trượt đá nước mài nhẵn thín và các vũng bơi sâu trong như ngọc bích.',
    highlightsEn: ['7 adventurous canyon doors & slides', 'Natural polished rock water chutes', 'Deep crystal emerald swimming pools'],
    highlightsVi: ['7 cửa ải trekking thử thách lòng quả cảm', 'Máng trượt đá nước mài nhẵn tự nhiên', 'Vũng bơi sâu ngọc bích giữa rừng già'],
    idealSeasonEn: 'May to September (Sunny weather required)',
    idealSeasonVi: 'Tháng 5 – 9 (Cần xem dự báo trời nắng ráo)',
    author: 'Thu'
  },
  {
    id: 'nui-coc-lake',
    category: 'lake',
    nameEn: 'Nui Coc Lake (Legend of Cong & Coc)',
    nameVi: 'Hồ Núi Cốc (Huyền Thoại Chàng Cốc)',
    tagEn: 'Romantic Midland Waterbody',
    tagVi: 'Hồ Nước Huyền Thoại 89 Hòn Đảo',
    locationEn: 'Thai Nguyen City & Dai Tu Basin',
    locationVi: 'Ranh giới TP. Thái Nguyên & Huyện Đại Từ',
    elevation: '60m MSL • 21°35′N 105°42′E',
    image: 'assets/images/nui-coc-lake.jpg',
    realPhotoCredit: 'Ảnh thực tế: Hồ Núi Cốc (Wikimedia Commons)',
    featured: false,
    descEn: 'A vast 2,500-hectare freshwater reservoir with 89 emerald islets rising from calm waters. Famous for the heartbreaking love legend of lovers Cong and Coc, it offers relaxing pleasure boat tours, fairy-tale water grottoes, lakeside tea villas, and vibrant entertainment parks.',
    descVi: 'Vùng hồ nước ngọt rộng hơn 2.500 ha ôm trọn 89 hòn đảo lớn nhỏ nhấp nhô xanh biếc. Gắn liền với khúc ca tình yêu bi tráng của nàng Công và chàng Cốc, nơi đây là không gian du ngoạn du thuyền lộng gió, ngắm hoàng hôn lãng mạn và trải nghiệm các công viên giải trí ven hồ.',
    highlightsEn: ['89 verdant islets across 2,500ha', 'Legendary love folk grottoes', 'Pleasure boat cruises and lakeside relaxation'],
    highlightsVi: ['89 hòn đảo xanh biếc giữa lòng hồ 2.500ha', 'Động huyền thoại chuyện tình Chàng Cốc Nàng Công', 'Du thuyền thưởng ngoạn hoàng hôn trên sóng nước'],
    idealSeasonEn: 'Spring, Summer & Autumn',
    idealSeasonVi: 'Mùa xuân, hè và thu',
    author: 'Thu'
  },
  {
    id: 'na-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Na Dang Cascades',
    nameVi: 'Thác Nà Đăng (Rừng Đầu Nguồn)',
    tagEn: 'Hidden Multi-tiered Falls',
    tagVi: 'Dải Lụa Trắng Hoang Sơ Giữa Đại Ngàn',
    locationEn: 'Northern Ba Be Forest Reserve',
    locationVi: 'Vùng đệm rừng núi phía Bắc Ba Bể',
    elevation: '210m MSL • 22°21′N 105°45′E',
    image: 'assets/images/na-dang-waterfall.jpg',
    realPhotoCredit: 'Ảnh thực tế: Thác suối tự nhiên Ba Bể (Wikimedia Commons)',
    featured: false,
    descEn: 'A secluded multi-tiered cascade spilling over rocky terraces framed by thick virgin canopies. Untouched by large-scale tourism, Na Dang offers complete peace, cool natural pools for swimming, and pristine spots for riverside picnics and birdwatching.',
    descVi: 'Ngọn thác nhiều tầng ẩn mình sâu trong thảm rừng nguyên sinh phía Bắc. Hoàn toàn thoát khỏi sự ồn ào xô bồ, Nà Đăng giữ nguyên vẹn vẻ đẹp thanh tao như dải lụa trắng buông rủ, là điểm dừng chân yên tĩnh tuyệt đối cho những chuyến dã ngoại và hòa mình vào thiên nhiên thuần khiết.',
    highlightsEn: ['Multi-tiered natural rock cascades', 'Completely untouched wilderness', 'Peaceful forest picnic retreats'],
    highlightsVi: ['Dòng thác đổ tầng mềm mại trên vách đá', 'Không gian hoang sơ tĩnh lặng tuyệt đối', 'Điểm dã ngoại, cắm trại bên bờ suối trong veo'],
    idealSeasonEn: 'Summer & Autumn',
    idealSeasonVi: 'Mùa hè và mùa thu',
    author: 'Thu'
  }
];

// --- REAL-WORLD VERIFIED SACRED PAGODAS & TEMPLES ---
const PAGODAS = [
  {
    id: 'duom-temple',
    nameEn: 'Duom Temple (Dương Tự Minh Từ)',
    nameVi: 'Đền Đuổm (Đức Thánh Dương Tự Minh)',
    tagEn: 'National Relic & Intangible Heritage',
    tagVi: 'Di Tích Quốc Gia & Di Sản Phi Vật Thể',
    locationEn: 'Dong Dat, Phu Luong (25km north on Route 3)',
    locationVi: 'Xã Động Đạt, Huyện Phú Lương (Km 25 Quốc lộ 3)',
    elevation: 'Mount Duom foot • 21°46′N 105°44′E',
    image: 'assets/images/den-duom.jpg',
    realPhotoCredit: 'Ảnh thực tế: Đền Đuổm dưới chân núi Điểm Sơn (Wikimedia Commons)',
    historyEn: 'Constructed in 1180 under King Ly Cao Tong at the base of the sacred six-peaked Mount Duom (Diem Son), positioned in perfect harmony with the four geomantic guardians: Vermilion Bird (front), Black Tortoise (rear), Azure Dragon (left), and White Tiger (right). The temple honors General Duong Tu Minh, the heroic Tay chieftain and Royal Son-in-law (Pho Ma Do Uy) who guarded the northern border and married two Ly Dynasty royal princesses, Dien Binh and Thieu Dung.',
    historyVi: 'Khởi dựng năm 1180 triều vua Lý Cao Tông dưới chân núi Điểm Sơn 6 ngọn sừng sững, đắc địa phong thủy tứ tượng: Tiền Chu Tước, Hậu Huyền Vũ, Tả Thanh Long, Hữu Bạch Hổ. Đền phụng thờ Đức Thánh Đuổm Dương Tự Minh - thủ lĩnh người Tày đức độ tài ba, Phò mã Đô úy triều Lý có công dẹp giặc Tống bảo vệ non sông, được hai đời vua gả Công chúa Diên Bình và Thiều Dung.',
    highlightsEn: [
      'Lower Temple (Đền Hạ): Honoring Princess Dien Binh & Princess Thieu Dung',
      'Middle Temple (Đền Trung): Main sanctum honoring General Duong Tu Minh',
      'Upper Temple (Đền Thượng): High on the cliffside honoring the General\'s Mother',
      'Ancient Bell Tower & Tam Quan Gate: Traditional Vietnamese timber joinery',
      'Mount Duom Natural Cliffs: Ancient rock formations resembling crouching elephants'
    ],
    highlightsVi: [
      'Đền Hạ: Tôn thờ hai vị phu nhân Công chúa Diên Bình & Thiều Dung',
      'Đền Trung: Cung điện chính thờ Phò mã Đô úy Dương Tự Minh',
      'Đền Thượng: Cheo leo áp sát vách đá núi Đuổm thờ Thánh Mẫu (Mẹ tướng quân)',
      'Lầu Chuông & Cổng Tam Quan: Kiến trúc gỗ cổ kính dưới tán đa cổ thụ',
      'Quần thể đá núi Điểm Sơn: Vách đá tự nhiên hình voi phục, hổ quỳ uy nghiêm'
    ],
    festivalEn: '5th & 6th of the 1st lunar month (National Intangible Cultural Heritage).',
    festivalVi: 'Mùng 5 và 6 tháng Giêng âm lịch (Di sản Văn hóa Phi vật thể Quốc gia).',
    tipsEn: [
      'Worship sequence: Ascend from bottom to top (Lower Temple → Middle Temple → Upper Temple).',
      'Footwear: Wear sturdy walking shoes or sneakers; stone stairs to Upper Temple are steep.',
      'Transportation: 25 km from Thai Nguyen City on National Highway 3; spacious parking for cars & motorbikes.'
    ],
    tipsVi: [
      'Thứ tự hành lễ: Chiêm bái từ thấp lên cao (Đền Hạ → Đền Trung → leo bậc đá lên Đền Thượng).',
      'Giày dép: Đi giày thể thao êm chân vì bậc đá lên Đền Thượng khá cao và dốc.',
      'Đường đi: Cách TP. Thái Nguyên 25km dọc Quốc lộ 3; bãi đỗ xe rộng rãi trước cổng đền.'
    ],
    souvenirsEn: 'Phu Luong & Tan Cuong green tea, black olives (trám đen), dried bamboo shoots, bamboo sticky rice (Cơm Lam), Tay brocade.',
    souvenirsVi: 'Trà xanh Phú Lương, chè Tân Cương, trám đen Hà Châu, măng khô đại ngàn, cơm lam nếp nương, thổ cẩm Tày - Nùng.',
    author: 'Ánh'
  },
  {
    id: 'chua-hang',
    nameEn: 'Chua Hang (Kim Son Tu / Cave Sanctuary)',
    nameVi: 'Chùa Hang (Kim Sơn Tự / Hang Chùa)',
    tagEn: '11th Century Cave Temple',
    tagVi: 'Cổ Tự Trong Lòng Núi Long Cổ',
    locationEn: 'Chua Hang Ward, Thai Nguyen City',
    locationVi: 'Phường Chùa Hang, TP. Thái Nguyên',
    elevation: 'Long Co Mountain • 21°37′N 105°51′E',
    image: 'assets/images/chua-hang-real.jpg',
    realPhotoCredit: 'Ảnh thực tế: Quần thể Chùa Hang Thái Nguyên (Wikimedia Commons)',
    historyEn: 'Established around the 11th century under the Ly Dynasty inside the three cavern vaults of Long Co Mountain. During the anti-French and anti-American resistance wars, the immense dry caves served as a secret unassailable base for ammunition, grain reserves, and temporary provincial command headquarters. Officially designated a National Historical & Scenic Relic in 1999.',
    historyVi: 'Khởi dựng từ thế kỷ XI triều Lý, tọa lạc trọn vẹn trong ba vòm hang đá vôi tự nhiên của dãy núi Long Cổ. Trong hai cuộc kháng chiến chống Pháp và chống Mỹ, hang chùa từng là kho đạn dược, lương thực và cơ quan sơ tán an toàn tuyệt mật của Trung ương và tỉnh. Năm 1999, chùa được xếp hạng Di tích Lịch sử Danh lam Thắng cảnh cấp Quốc gia.',
    highlightsEn: [
      'Main Cave Sanctuary (Chùa Hang Trong - Động Kim Sơn): Buddha altars beneath stalactites',
      'Outer Pagoda & Upper Shrine (Chùa Hang Ngoài): Traditional shrines on mountain slope',
      'Patriarchs\' Hall & Mother Goddess Shrine (Điện Mẫu Tam Phủ)',
      'Long Co Peak Viewpoint: Panoramic view of Cau River and rolling tea hills'
    ],
    highlightsVi: [
      'Chùa Hang Trong (Động Kim Sơn): Cung Tam Bảo huyền bí dưới vòm thạch nhũ ngàn năm',
      'Chùa Hang Ngoài & Chùa Trên: Quần thể gỗ đá linh thiêng dưới bóng cây rừng',
      'Nhà Tổ & Điện Mẫu Tam Phủ: Điểm tựa tâm linh sâu sắc của nhân dân địa phương',
      'Đỉnh núi Long Cổ: Điểm vọng cảnh toàn cảnh dòng sông Cầu và TP. Thái Nguyên'
    ],
    festivalEn: 'Spring Festival on the 19th – 21st days of the 1st lunar month.',
    festivalVi: 'Lễ hội Xuân Chùa Hang từ ngày 19 đến 21 tháng Giêng âm lịch.',
    tipsEn: [
      'Cave footing: Cave floor can be damp; wear shoes with good tread. Use phone flashlight for side grottos.',
      'Safety: Avoid touching wet stalactites to preserve natural geological growth.',
      'Incense: Light incense at the large courtyard burner to keep the cave air fresh.'
    ],
    tipsVi: [
      'Nền hang đá: Có thể ẩm ướt, nên đi giày chống trượt; bật đèn pin điện thoại khi xem ngách đá.',
      'An toàn: Tuyệt đối không chạm tay hoặc bẻ nhũ đá để bảo vệ di sản thiên nhiên.',
      'Thắp hương: Thắp hương tại lư hương lớn ngoài sân để giữ không khí trong lành trong hang.'
    ],
    souvenirsEn: 'Tân Cương green tea, famous Bánh Chưng Bờ Đậu (traditional square sticky rice cake), Cơm Lam, lucky bracelets.',
    souvenirsVi: 'Trà Tân Cương, Bánh chưng Bờ Đậu gia truyền, cơm lam ống nứa, chuỗi tràng hạt may mắn.',
    author: 'Ánh'
  },
  {
    id: 'phu-lien-pagoda',
    nameEn: 'Phu Lien Pagoda (Phù Chân Thiền Tự)',
    nameVi: 'Chùa Phù Liễn (Phù Chân Thiền Tự)',
    tagEn: 'Sanctuary of Truth & Righteousness',
    tagVi: 'Chốn Già Lam Bảo Hộ Đạo Nghĩa',
    locationEn: 'Hoang Van Thu Ward, Thai Nguyen City',
    locationVi: 'Phường Hoàng Văn Thụ, TP. Thái Nguyên',
    elevation: 'Hilltop sanctuary • 21°35′N 105°50′E',
    image: 'assets/images/chua-phu-lien.jpg',
    realPhotoCredit: 'Ảnh tư liệu: Cổ tự Phù Liễn Thái Nguyên',
    historyEn: 'Named after the historic Phu Lien Village established during the Ly Dynasty. In 1896, French colonial authorities relocated the pagoda to its current commanding hilltop location. During the resistance, it sheltered insurgent fighters loyal to national heroes Hoang Hoa Tham and Doi Can. It houses the revered golden-leaf plaque "Linh Son Phuc Dia" (Sacred Mountain & Auspicious Land) and serves as the Provincial Buddhist Association Headquarters.',
    historyVi: 'Mang tên làng Phù Liễn có từ thời Lý (Phù Liên Hương). Năm 1896, thực dân Pháp chuyển chùa về vị trí đồi cao hiện nay. Trong phong trào chống Pháp, chùa từng là cơ sở nuôi giấu nghĩa quân của Hoàng Hoa Thám và Đội Cấn. Chùa lưu giữ bức hoành phi thếp vàng "Linh Sơn Phúc Địa" (Núi thiêng đất phúc) và là Trụ sở Ban Trị sự Phật giáo tỉnh Thái Nguyên.',
    highlightsEn: [
      'Main Sanctuary (Tam Bảo) with golden plaque "Linh Son Phuc Dia"',
      'Mother Goddess Hall (Điện Mẫu) & Patriarchs\' Shrine (Nhà Tổ)',
      'Outdoor Compassionate Guanyin Bodhisattva Statue',
      'Ancient Stupa Garden holding the relics of head monks',
      'Thai Nguyen Provincial Buddhist Executive Board Headquarters'
    ],
    highlightsVi: [
      'Tòa Tam Bảo trang nghiêm với bức đại tự "Linh Sơn Phúc Địa"',
      'Điện Mẫu thờ Tam Phủ & Nhà Thờ Tổ tôn vinh các bậc tiền nhân',
      'Tượng Phật Bà Quan Âm lộ thiên từ bi giữa khuôn viên rợp bóng',
      'Vườn tháp cổ lưu giữ xá lị các đời viện chủ trụ trì',
      'Trụ sở Ban Trị sự Giáo hội Phật giáo Việt Nam tỉnh Thái Nguyên'
    ],
    festivalEn: 'Annual Festival on the 12th day of the 1st lunar month (cockfighting, bamboo swinging, Chinese chess).',
    festivalVi: 'Lễ hội chùa ngày 12 tháng Giêng âm lịch (chọi gà, đu tiên, cờ người).',
    tipsEn: [
      'Attire: Modest clothing covering shoulders and below knees. Remove hats and sunglasses before entering shrines.',
      'Entry etiquette: Enter through the right gate (Right Awareness), exit through the left gate (Liberation). Never step on thresholds.',
      'Offerings: Strictly vegetarian (fresh flowers, ripe fruit, incense, pure cakes).'
    ],
    tipsVi: [
      'Trang phục: Kín đáo lịch sự, che vai và dài quá gối; tháo mũ nón trước khi vào điện thờ.',
      'Lối ra vào: Đi vào cửa phải (cửa Giác quan), đi ra cửa trái (cửa Giải thoát); không dẫm chân lên bậu cửa.',
      'Đồ lễ: Chỉ dâng lễ chay thanh tịnh (hoa tươi, trái cây chín, oản chay); dâng hương tại lư hương sân chùa.'
    ],
    souvenirsEn: 'Premium Tan Cuong tea gift boxes, bodhi bead bracelets, Buddhist peace amulets.',
    souvenirsVi: 'Hộp trà Tân Cương biếu tặng cao cấp, chuỗi vòng hạt bồ đề, bùa bình an Phật giáo.',
    author: 'Ánh'
  }
];

// --- REAL-WORLD VERIFIED HOSPITALS & CLINICS ---
const HOSPITALS = [
  {
    id: 'bv-dk-tw-tn',
    nameEn: 'Thai Nguyen National General Hospital',
    nameVi: 'Bệnh viện Đa khoa Trung ương Thái Nguyên',
    typeEn: 'Special-Class National Hospital',
    typeVi: 'Bệnh viện Hạng Đặc biệt (Bộ Y tế)',
    descEn: 'Founded in 1951, one of only six special-class hospitals in Vietnam. With over 2,050 bed capacity, it conducts high-tech surgical procedures: laparoscopic kidney transplants, open/closed heart surgeries, and advanced IVF.',
    descVi: 'Thành lập năm 1951, một trong sáu bệnh viện hạng đặc biệt toàn quốc trực thuộc Bộ Y tế. Quy mô hơn 2.050 giường bệnh, làm chủ kỹ thuật cao: ghép thận nội soi, phẫu thuật tim hở, can thiệp mạch máu và thụ tinh ống nghiệm IVF.',
    address: '479 Luong Ngoc Quyen, Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0208 3855 125',
    emergency: '115 / 0208 3855 125',
    area: 'city',
    author: 'Thủy'
  },
  {
    id: 'bv-a-tn',
    nameEn: 'Thai Nguyen A Hospital',
    nameVi: 'Bệnh viện A Thái Nguyên',
    typeEn: 'Provincial General Hospital',
    typeVi: 'Bệnh viện Đa khoa Hạng I Tuyến tỉnh',
    descEn: 'Over 60 years of history on Quang Trung Street. Specializes in obstetrics, pediatrics, internal medicine, surgery, and public health.',
    descVi: 'Hơn 60 năm lịch sử trên đường Quang Trung, phường Thịnh Đán. Mũi nhọn chuyên sâu về sản phụ khoa, nhi khoa, ngoại tổng hợp và chăm sóc sức khỏe cộng đồng.',
    address: 'Quang Trung Street, Thinh Dan Ward, Thai Nguyen City',
    phone: '0208 3846 112',
    emergency: '0208 3846 112',
    area: 'city',
    author: 'Thủy'
  },
  {
    id: 'bv-pham-ngoc-thach',
    nameEn: 'Pham Ngoc Thach Hospital Thai Nguyen',
    nameVi: 'Bệnh viện Phạm Ngọc Thạch Thái Nguyên',
    typeEn: 'Specialized Hospital',
    typeVi: 'Bệnh viện Chuyên khoa Tuyến tỉnh',
    descEn: 'Formerly Thai Nguyen City Medical Center in Phan Dinh Phung Ward. Provides specialized diagnostic, pulmonary, and community treatments.',
    descVi: 'Tiền thân là Trung tâm Y tế TP. Thái Nguyên tại phường Phan Đình Phùng, thực hiện khám chữa bệnh chuyên sâu và chăm sóc sức khỏe nhân dân.',
    address: 'Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0208 3856 211',
    emergency: '0208 3856 211',
    area: 'city',
    author: 'Thủy'
  },
  {
    id: 'dinh-hoa-hospital',
    nameEn: 'Dinh Hoa General Hospital (ATK Safe Zone)',
    nameVi: 'Bệnh viện Đa khoa Huyện Định Hóa (Vùng ATK)',
    typeEn: 'District General Hospital',
    typeVi: 'Bệnh viện Đa khoa Tuyến Huyện (Vùng ATK)',
    descEn: 'Established Oct 2, 2008 under Decision 2347/QD-UBND. Equipped with 75 patient beds, ensuring healthcare, first aid, and emergency medical security for residents and tourists visiting the Dinh Hoa Safe Zone (ATK).',
    descVi: 'Thành lập ngày 02/10/2008 theo QĐ 2347/QĐ-UBND tỉnh Thái Nguyên. Quy mô 75 giường bệnh, đảm bảo chăm sóc sức khỏe và cấp cứu du khách tham quan Khu di tích Lịch sử ATK Định Hóa.',
    address: 'Cho Chu Town, Dinh Hoa District',
    phone: '0208 3878 223',
    emergency: '0208 3878 223',
    area: 'dinh-hoa',
    author: 'Thủy'
  },
  {
    id: 'nui-coc-medical',
    nameEn: 'Nui Coc Lake First Aid Stations (Phuc Triu & An Khanh)',
    nameVi: 'Trạm Y tế Khu vực Hồ Núi Cốc (Phúc Trìu & An Khánh)',
    typeEn: 'Tourism First Aid Outpost',
    typeVi: 'Trạm Y tế Cấp cứu ban đầu khu du lịch',
    descEn: 'Phuc Triu Health Station (East Coast) & An Khanh Health Station (Dai Tu lakeside). Provides round-the-clock first aid, routine checkups, heat exhaustion treatments, and emergency stabilization for tourists around Nui Coc Lake.',
    descVi: 'Trạm Y tế Phúc Trìu (Bờ Đông hồ Núi Cốc) & Trạm Y tế An Khánh (huyện Đại Từ kề cận hồ). Trực 24/7 sơ cấp cứu du khách, xử trí say nắng, chấn thương ban đầu khi du lịch hồ.',
    address: 'Phuc Triu Commune (City) & An Khanh Commune (Dai Tu)',
    phone: '0208 3825 119',
    emergency: '0208 3825 119',
    area: 'nui-coc',
    author: 'Thủy'
  }
];

// --- SEASONS EDITORIAL DATA ---
const SEASONS_DATA = {
  spring: {
    temp: '20 – 23°C',
    rainfall: 'Light drizzle (Mưa xuân lất phất)',
    humidity: '82 – 84%',
    descEn: 'Spring (February to April) awakens the midland hills with soft mist and refreshing breezes. The tender emerald tea buds sprout on every slope while centuries-old ethnic festivals resound across valley stilt villages.',
    descVi: 'Mùa xuân (Tháng 2 – 4) tiết trời mát lành, mưa xuân lất phất đánh thức sức sống đại ngàn. Những đồi chè nhú búp non tơ thơm ngát và tiếng đàn Tính, điệu Then rộn rã khắp các lễ hội xuống đồng bản làng.',
    activitiesEn: ['Duom Temple Festival pilgrimage (5th-6th lunar month)', 'Witnessing Tan Cuong spring tea harvest', 'Ba Be Long Tong festival & dugout boat races'],
    activitiesVi: ['Trẩy hội Đền Đuổm, Chùa Hang đầu xuân', 'Ngắm búp chè xuân Tân Cương bừng sắc', 'Dự hội Lồng Tồng và đua thuyền độc mộc Ba Bể'],
    packEn: 'Light windbreaker, umbrella for spring drizzle, comfortable walking sneakers.',
    packVi: 'Áo khoác gió nhẹ, ô che mưa xuân, giày đi bộ êm ái.'
  },
  summer: {
    temp: '28 – 34°C',
    rainfall: 'Frequent afternoon showers',
    humidity: '85 – 88%',
    descEn: 'Summer (May to August) brings brilliant sunshine and lush green mountain canopies. The perfect time to immerse in crystal emerald streams, cruise across calm Ba Be waters, and explore cool limestone caves.',
    descVi: 'Mùa hè (Tháng 5 – 8) nắng vàng rực rỡ, cây rừng xanh thẫm. Đây là mùa lý tưởng nhất để chèo thuyền trên hồ Ba Bể lộng gió, ngâm mình dưới suối Cửa Tử và khám phá các vòm hang động mát rượi 18°C.',
    activitiesEn: ['Boat voyage through Puong Cave & Ba Be Lake', 'Cua Tu canyon trekking & natural pool swim', 'Picnic and swimming at Mo Ga crystal stream'],
    activitiesVi: ['Du thuyền hồ Ba Bể, xuyên động Puông ngắm dơi', 'Trekking suối Cửa Tử, trượt máng đá tự nhiên', 'Tắm mát và dã ngoại tại suối Mỏ Gà Võ Nhai'],
    packEn: 'Quick-dry clothes, waterproof bag for phone/camera, swimwear, river trekking shoes.',
    packVi: 'Trang phục mau khô, túi chống nước điện thoại, đồ bơi, giày lội suối.'
  },
  autumn: {
    temp: '22 – 27°C',
    rainfall: 'Moderate to low (Dry, crisp air)',
    humidity: '75 – 80%',
    descEn: 'Autumn (September to November) is the indisputable "golden season" of Thai Nguyen. Crisp mountain air, azure skies, golden sunshine pouring across tea hills, and optimal conditions for photography and trekking.',
    descVi: 'Mùa thu (Tháng 9 – 11) là "mùa vàng" đẹp nhất trong năm của Thái Nguyên. Trời cao trong xanh, gió thu dịu mát, nắng vàng rót mật trên nương chè mâm xôi, khí hậu tuyệt hảo cho săn ảnh và đi bộ đường dài.',
    activitiesEn: ['Tea hill sunrise photography in Tan Cuong', 'Trekking to Hua Ma Cave & Dau Dang rapids', 'Stays in authentic Tay wooden stilt houses'],
    activitiesVi: ['Săn ảnh bình minh nương chè Tân Cương', 'Trekking động Hua Mạ và ngắm thác Đầu Đẳng', 'Nghỉ dưỡng homestay nhà sàn Pác Ngòi bên hồ'],
    packEn: 'Camera, light layers for evening chill, sunhat, sturdy hiking boots.',
    packVi: 'Máy ảnh, áo khoác mỏng cho buổi tối se lạnh, nón mũ, giày leo núi.'
  },
  winter: {
    temp: '13 – 18°C',
    rainfall: 'Low (Dry season)',
    humidity: '70 – 75%',
    descEn: 'Winter (December to February) brings cool northern winds and cozy misty mornings. Perfect for cultural exploration, warming up beside stilt-house hearth fires, and tasting freshly roasted Tan Cuong tea.',
    descVi: 'Mùa đông (Tháng 12 – 2) tiết trời se lạnh khô ráo, sương mù lãng đãng quanh các đỉnh núi đá vôi. Rất thích hợp cho du lịch về nguồn văn hóa, quây quần bên bếp lửa nhà sàn và nhâm nhi tách trà Tân Cương ấm nồng.',
    activitiesEn: ['Tea appreciation workshops with local masters', 'Exploring President Ho Chi Minh\'s shack at ATK Dinh Hoa', 'Enjoying Com Lam & warm Banh Chung by hearth fires'],
    activitiesVi: ['Học nghệ thuật thưởng trà cùng nghệ nhân Tân Cương', 'Về nguồn An toàn khu ATK Định Hóa, lán Tỉn Keo', 'Thưởng thức cơm lam, bánh chưng Bờ Đậu bên bếp than hồng'],
    packEn: 'Warm coat, wool scarf, thermal layers, moisturizer.',
    packVi: 'Áo khoác ấm, khăn quàng cổ, quần áo giữ nhiệt.'
  }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTranslations();
  renderDestinations();
  renderSeasons('spring');
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

  // Re-render dynamic elements
  renderDestinations();
  renderSeasons(state.activeSeason);
  renderPagodas();
  renderHospitals();
  renderSavedPlacesList();

  // Update button visual
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = state.lang === 'en'
      ? '<span class="text-xs font-bold text-emerald-900 bg-amber-200/80 px-2 py-0.5 rounded">EN</span> <span class="text-xs text-slate-500 font-medium px-1">VI</span>'
      : '<span class="text-xs text-slate-500 font-medium px-1">EN</span> <span class="text-xs font-bold text-emerald-900 bg-amber-200/80 px-2 py-0.5 rounded">VI</span>';
  }
}

function initTranslations() {
  const langToggle = document.getElementById('lang-toggle-btn');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = state.lang === 'en' ? 'vi' : 'en';
      setLanguage(newLang);
      showToast(newLang === 'en' ? 'Language switched to English' : 'Đã chuyển sang Tiếng Việt');
    });
  }
  setLanguage(state.lang);
}

// --- RENDER DESTINATIONS (MAGAZINE BENTO & EDITORIAL CARDS) ---
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
      <div class="col-span-full py-16 text-center text-slate-500 bg-white/60 rounded-3xl border border-dashed border-amber-300">
        <svg class="w-12 h-12 mx-auto text-amber-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p class="text-base font-serif">${state.lang === 'en' ? 'No destinations found matching your query.' : 'Không tìm thấy danh thắng nào phù hợp với từ khóa này.'}</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition">
          ${state.lang === 'en' ? 'Reset Search & Filters' : 'Đặt lại bộ lọc tìm kiếm'}
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;
    const loc = state.lang === 'vi' ? item.locationVi : item.locationEn;
    const season = state.lang === 'vi' ? item.idealSeasonVi : item.idealSeasonEn;
    const isSaved = state.savedPlaces.some(p => p.id === item.id);
    const isSpan2 = (item.id === 'babe-lake' || item.id === 'tan-cuong-tea-hills') && state.activeFilter === 'all';

    return `
      <article class="paper-card rounded-2xl overflow-hidden flex flex-col justify-between group ${isSpan2 ? 'lg:col-span-2' : ''}">
        <div>
          <!-- Real Photo Frame -->
          <div class="relative ${isSpan2 ? 'h-72 sm:h-80' : 'h-60'} overflow-hidden editorial-photo-wrap">
            <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <!-- Authentic Photo Tag Stamp -->
            <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span class="editorial-stamp bg-white/95 backdrop-blur-sm text-[10px] text-slate-800 shadow-sm border-emerald-700">
                ${tag}
              </span>
            </div>

            <!-- Wishlist Heart Button -->
            <button onclick="toggleSavePlace('${item.id}', event)" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-red-600 transition shadow-sm" title="Save Place">
              <svg class="w-4 h-4 ${isSaved ? 'text-red-500 fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>

            <!-- Bottom Image Info Bar -->
            <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span class="font-medium flex items-center gap-1 drop-shadow-sm">
                <svg class="w-3.5 h-3.5 text-amber-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                <span class="truncate">${loc}</span>
              </span>
              <span class="text-[10px] text-emerald-200 hidden sm:inline font-mono">${item.elevation}</span>
            </div>
          </div>

          <!-- Editorial Card Content -->
          <div class="p-6">
            <div class="flex items-baseline justify-between gap-2 mb-1.5">
              <span class="text-[11px] font-mono uppercase tracking-wider text-amber-700 font-semibold">Entry No. 0${idx + 1}</span>
              <span class="text-[11px] text-slate-500 italic">Ghi chép: ${item.author}</span>
            </div>

            <h3 class="text-xl sm:text-2xl font-display font-bold text-slate-900 group-hover:text-emerald-800 transition tracking-tight mb-2.5">
              ${name}
            </h3>

            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-light">
              ${desc}
            </p>

            <div class="text-[10px] text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
              <span>${item.realPhotoCredit}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-6 pb-6 pt-2">
          <div class="flex items-center justify-between text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 mb-3">
            <span class="font-medium">${state.lang === 'en' ? 'Ideal Timing:' : 'Thời điểm lý tưởng:'}</span>
            <span class="font-semibold text-amber-800">${season}</span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openDestinationModal('${item.id}')" class="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-1.5 shadow-sm">
              <span>${state.lang === 'en' ? 'Examine Field Details' : 'Xem chi tiết & Bản đồ'}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// --- CLIMATE & SEASONS RENDER ---
function renderSeasons(seasonKey) {
  state.activeSeason = seasonKey;
  const data = SEASONS_DATA[seasonKey];
  const container = document.getElementById('season-details-container');
  if (!container || !data) return;

  document.querySelectorAll('.season-btn').forEach(btn => {
    if (btn.getAttribute('data-season') === seasonKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const desc = state.lang === 'vi' ? data.descVi : data.descEn;
  const activities = state.lang === 'vi' ? data.activitiesVi : data.activitiesEn;
  const pack = state.lang === 'vi' ? data.packVi : data.packEn;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left Atmospheric Gauge -->
      <div class="lg:col-span-4 bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-md">
        <div>
          <span class="editorial-stamp border-emerald-400 text-emerald-300">
            ${state.lang === 'en' ? 'Atmospheric Ledger' : 'Chỉ số Khí tượng Thực địa'}
          </span>
          <h4 class="text-2xl font-serif font-bold text-white mt-2 capitalize">${seasonKey} Rhythms</h4>
          
          <div class="mt-6 space-y-4">
            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <span class="text-[11px] text-emerald-200 uppercase tracking-wide block">${state.lang === 'en' ? 'Average Temperature' : 'Nhiệt độ bình quân'}</span>
              <span class="text-xl font-bold font-serif text-white">${data.temp}</span>
            </div>

            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <span class="text-[11px] text-emerald-200 uppercase tracking-wide block">${state.lang === 'en' ? 'Precipitation Rhythm' : 'Đặc trưng lượng mưa'}</span>
              <span class="text-sm font-semibold text-amber-200">${data.rainfall}</span>
            </div>

            <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
              <span class="text-[11px] text-emerald-200 uppercase tracking-wide block">${state.lang === 'en' ? 'Relative Humidity' : 'Độ ẩm không khí'}</span>
              <span class="text-base font-bold text-teal-200">${data.humidity}</span>
            </div>
          </div>
        </div>

        <div class="pt-4 mt-6 border-t border-white/15 text-[11px] text-emerald-300 flex items-center justify-between">
          <span>Khảo cứu: thainguyen.gov.vn</span>
          <span class="italic">Biên soạn: Hương</span>
        </div>
      </div>

      <!-- Right Editorial Guide -->
      <div class="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
        <div>
          <h4 class="text-xl font-serif font-bold text-slate-900 mb-2">
            ${state.lang === 'en' ? 'Seasonal Highlights & Exploration' : 'Trải nghiệm & Khám phá Thực tế Theo Mùa'}
          </h4>
          <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
            ${desc}
          </p>

          <h5 class="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
            <span class="text-amber-600">✦</span>
            <span>${state.lang === 'en' ? 'Curated Experiences for This Season' : 'Những trải nghiệm không nên bỏ lỡ'}</span>
          </h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            ${activities.map(act => `
              <div class="flex items-start gap-2 text-xs text-slate-700 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <span class="text-emerald-700 font-bold shrink-0">✓</span>
                <span>${act}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 flex items-start gap-3">
          <div class="p-2 bg-amber-200/70 text-amber-900 rounded-lg shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <div>
            <h6 class="text-xs font-bold text-amber-950 uppercase tracking-wide">${state.lang === 'en' ? 'Field Packing Advice' : 'Lời khuyên hành trang thực địa'}</h6>
            <p class="text-xs text-amber-900/90 mt-0.5">${pack}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- RENDER PAGODAS & TEMPLES (ARCHITECTURAL MONOGRAPH) ---
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
      <div class="paper-card rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        <!-- Real Image Column -->
        <div class="lg:w-5/12 relative min-h-[300px] lg:min-h-full editorial-photo-wrap">
          <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>

          <div class="absolute top-4 left-4">
            <span class="editorial-stamp-terracotta bg-white/95 text-[10px] font-bold px-3 py-1 rounded shadow-sm">
              ${tag}
            </span>
          </div>

          <div class="absolute bottom-6 left-6 right-6 text-white">
            <span class="text-[11px] text-amber-300 font-mono tracking-widest uppercase">Monograph No. 0${idx + 1} • Ghi chép: ${item.author}</span>
            <h3 class="text-2xl font-serif font-bold text-white mt-1">${name}</h3>
            <p class="text-xs text-slate-300 mt-1 flex items-center gap-1.5 font-light">
              <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${loc}</span>
            </p>
            <div class="text-[10px] text-slate-400 mt-2 italic">${item.realPhotoCredit}</div>
          </div>
        </div>

        <!-- Text & Detail Column -->
        <div class="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span class="text-amber-600">❖</span>
                <span>${state.lang === 'en' ? 'Historical Significance & Legend' : 'Ý nghĩa Lịch sử & Cội nguồn Huyền tích'}</span>
              </h4>
              <p class="text-slate-700 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">${history}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <span class="text-amber-600">❖</span>
                <span>${state.lang === 'en' ? 'Key Shrines & Architectural Points' : 'Điểm Chiêm bái & Kiến trúc Tiêu biểu'}</span>
              </h4>
              <ul class="mt-2 space-y-1.5 text-xs text-slate-700">
                ${highlights.slice(0, 4).map(hl => `
                  <li class="flex items-start gap-2">
                    <span class="text-amber-700 font-bold shrink-0">✦</span>
                    <span>${hl}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 mb-4">
              <strong>🎉 ${state.lang === 'en' ? 'Sacred Festival Date:' : 'Lễ hội truyền thống:'}</strong> ${festival}
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span>${state.lang === 'en' ? 'Essential Worship Etiquette' : 'Phép tắc Hành lễ Cần nhớ'}</span>
              </h4>
              <ul class="mt-1.5 space-y-1 text-xs text-slate-600">
                ${tips.slice(0, 2).map(tip => `
                  <li class="flex items-start gap-1.5">
                    <span class="text-amber-700">•</span>
                    <span>${tip}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="text-slate-600">
              <strong class="text-slate-900">🎁 ${state.lang === 'en' ? 'Local Specialties & Gifts:' : 'Đặc sản làm quà:'}</strong> ${souvenirs}
            </div>
            <button onclick="toggleSavePlace('${item.id}', event)" class="shrink-0 px-4 py-2 border border-emerald-800 text-emerald-900 hover:bg-emerald-50 rounded-xl transition text-xs font-semibold">
              ${state.savedPlaces.some(p => p.id === item.id)
                ? (state.lang === 'en' ? '✓ Saved in Plan' : '✓ Đã lưu')
                : (state.lang === 'en' ? '+ Bookmark Shrine' : '+ Lưu vào hành trình')}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- RENDER HOSPITALS & CLINICS ---
function renderHospitals() {
  const container = document.getElementById('hospitals-grid');
  if (!container) return;

  container.innerHTML = HOSPITALS.map(item => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const type = state.lang === 'vi' ? item.typeVi : item.typeEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;

    return `
      <div class="paper-card p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="editorial-stamp-forest text-[10px]">
              ${type}
            </span>
            <span class="text-[11px] text-slate-400 italic">Khảo sát: ${item.author}</span>
          </div>

          <h4 class="text-base font-serif font-bold text-slate-900 mt-2">${name}</h4>
          <p class="text-slate-600 text-xs mt-2 leading-relaxed font-light">${desc}</p>

          <div class="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-slate-600">
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

        <div class="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2">
          <a href="tel:${item.phone.replace(/[^0-9]/g, '')}" class="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 shadow-sm">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>${state.lang === 'en' ? 'Direct Hotline Call' : 'Gọi cấp cứu'}</span>
          </a>
          <button onclick="copyToClipboard('${item.phone}', '${state.lang === 'en' ? 'Phone number copied!' : 'Đã sao chép số điện thoại!'}')" class="p-2 border border-stone-200 hover:bg-stone-50 text-slate-600 rounded-xl transition" title="Copy Number">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- DESTINATION MODAL (LIGHTBOX) ---
function openDestinationModal(id) {
  const item = DESTINATIONS.find(d => d.id === id);
  if (!item) return;

  const modal = document.getElementById('destination-modal');
  const modalContent = document.getElementById('modal-content-container');
  if (!modal || !modalContent) return;

  const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
  const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
  const desc = state.lang === 'vi' ? item.descVi : item.descEn;
  const loc = state.lang === 'vi' ? item.locationVi : item.locationEn;
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
        <div class="flex items-center gap-2 mb-2">
          <span class="editorial-stamp bg-white/95 text-slate-900 text-xs">${tag}</span>
          <span class="text-xs text-amber-300 font-mono">${item.elevation}</span>
        </div>
        <h2 class="text-2xl md:text-4xl font-serif font-bold text-white">${name}</h2>
        <p class="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-light">
          <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          <span>${loc}</span>
        </p>
      </div>
    </div>

    <div class="p-6 md:p-8 space-y-6">
      <div>
        <span class="editorial-stamp-forest text-[10px] mb-2 inline-block">
          ${state.lang === 'en' ? 'Field Observations' : 'Ghi chép Khảo sát Thực địa'}
        </span>
        <p class="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed font-light">${desc}</p>
        <p class="text-[11px] text-slate-400 italic mt-2">${item.realPhotoCredit}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">${state.lang === 'en' ? 'Key Features & Sights' : 'Điểm nhấn quan trọng'}</h5>
          <ul class="space-y-1.5 text-xs text-slate-600">
            ${highlights.map(h => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-amber-950 mb-2">${state.lang === 'en' ? 'Optimal Visiting Window' : 'Khoảng thời gian lý tưởng nhất'}</h5>
          <p class="text-xs text-amber-900 leading-relaxed">${season}</p>
          <div class="mt-3 text-[11px] text-amber-800 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>${state.lang === 'en' ? 'Always verify local stream flow levels during rain.' : 'Lưu ý kiểm tra mực nước suối khi có mưa nguồn.'}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button onclick="toggleSavePlace('${item.id}'); openDestinationModal('${item.id}');" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border ${isSaved ? 'border-red-300 bg-red-50 text-red-700' : 'border-stone-300 text-slate-700 hover:bg-stone-50'} text-xs font-semibold flex items-center justify-center gap-2 transition">
          <svg class="w-3.5 h-3.5 ${isSaved ? 'fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span>${isSaved ? (state.lang === 'en' ? 'Remove from Saved' : 'Bỏ lưu khỏi danh sách') : (state.lang === 'en' ? 'Save This Destination' : 'Lưu điểm đến này')}</span>
        </button>

        <a href="#itinerary-builder" onclick="closeDestinationModal()" class="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition text-center shadow-sm">
          ${state.lang === 'en' ? 'Explore in Tour Itineraries' : 'Xem trong lịch trình mẫu'}
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
        <svg class="w-10 h-10 mx-auto text-stone-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        <p class="text-xs font-serif">${state.lang === 'en' ? 'Your itinerary is currently empty.' : 'Danh sách hành trình của bạn hiện đang trống.'}</p>
        <p class="text-[11px] text-slate-400 mt-1">${state.lang === 'en' ? 'Click the heart icon on any spot to save it.' : 'Nhấp biểu tượng trái tim ở điểm bất kỳ để lưu vào đây.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.savedPlaces.map(p => {
    const name = state.lang === 'vi' ? p.nameVi : p.nameEn;
    return `
      <div class="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
        <div class="flex items-center gap-3">
          <img src="${p.image}" alt="${name}" class="w-12 h-12 rounded-lg object-cover">
          <div>
            <h5 class="text-xs font-serif font-bold text-slate-900">${name}</h5>
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
    if (!AudioContext) {
      showToast('Audio not supported on this browser');
      return;
    }

    state.audioCtx = new AudioContext();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    // 1. Create gentle stream pink noise
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.016;
      b6 = white * 0.115926;
    }

    const whiteNoise = state.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, state.audioCtx.currentTime);

    const gainNode = state.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.035, state.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(state.audioCtx.destination);
    whiteNoise.start();
    state.ambientNode = whiteNoise;

    // 2. Play subtle Vietnamese pentatonic bell chords (C, D, F, G, A)
    const pentatonicNotes = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25];
    function playChime() {
      if (!state.soundPlaying || !state.audioCtx) return;
      const osc = state.audioCtx.createOscillator();
      const chimeGain = state.audioCtx.createGain();
      const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

      chimeGain.gain.setValueAtTime(0, state.audioCtx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.045, state.audioCtx.currentTime + 0.12);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 3.2);

      osc.connect(chimeGain);
      chimeGain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 3.4);
    }

    playChime();
    state.chimeInterval = setInterval(playChime, 3800);

    state.soundPlaying = true;
    updateSoundBtnUI(true);
    showToast(state.lang === 'en' ? 'Acoustic tea field soundscape playing' : 'Đang phát âm thanh thiên nhiên nương chè');
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
  showToast(state.lang === 'en' ? 'Soundscape paused' : 'Đã tạm dừng âm thanh');
}

function updateSoundBtnUI(isPlaying) {
  const btn = document.getElementById('ambient-sound-btn');
  const reel = document.getElementById('recorder-reel');
  const waveContainer = document.getElementById('sound-wave-bars');
  const label = document.getElementById('sound-btn-label');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.add('sound-playing', 'bg-emerald-900', 'text-amber-200');
    if (reel) reel.classList.add('reel-spinning');
    if (waveContainer) waveContainer.classList.remove('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Acoustic: On' : 'Âm thanh: Đang phát';
  } else {
    btn.classList.remove('sound-playing', 'bg-emerald-900', 'text-amber-200');
    if (reel) reel.classList.remove('reel-spinning');
    if (waveContainer) waveContainer.classList.add('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Field Soundscape' : 'Âm thanh bản địa';
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

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.getAttribute('data-filter') || 'all';
      renderDestinations();
    });
  });

  document.querySelectorAll('.season-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const season = btn.getAttribute('data-season');
      if (season) renderSeasons(season);
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
  document.querySelectorAll('.filter-btn').forEach(b => {
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
    toast.className = 'fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-serif px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none flex items-center gap-2 border border-stone-700';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="text-amber-400 font-bold">✦</span>
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
      link.classList.remove('text-emerald-900', 'font-bold', 'border-b-2', 'border-emerald-800');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('text-emerald-900', 'font-bold', 'border-b-2', 'border-emerald-800');
      }
    });
  });
}

function printItinerary() {
  window.print();
}

window.setLanguage = setLanguage;
window.renderSeasons = renderSeasons;
window.openDestinationModal = openDestinationModal;
window.closeDestinationModal = closeDestinationModal;
window.toggleSavePlace = toggleSavePlace;
window.openSavedModal = openSavedModal;
window.closeSavedModal = closeSavedModal;
window.copyToClipboard = copyToClipboard;
window.resetFilters = resetFilters;
window.printItinerary = printItinerary;
