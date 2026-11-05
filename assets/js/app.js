/**
 * Thai Nguyen Tourism - Interactive Web Application Script
 * Provides bilingual support, destination filters, modal viewer,
 * interactive timeline, climate explorer, trip planner, and soundscape.
 */

// --- STATE MANAGEMENT ---
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

// --- DATA COLLECTIONS ---
const DESTINATIONS = [
  {
    id: 'babe-lake',
    category: 'lake',
    nameEn: 'Ba Be Lake',
    nameVi: 'Hồ Ba Bể',
    tagEn: 'Ecotourism Wonder',
    tagVi: 'Kỳ quan Sinh thái',
    locationEn: 'Ba Be National Park, Northern Thai Nguyen',
    locationVi: 'Vườn Quốc gia Ba Bể, Bắc Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
    descEn: 'One of the most impressive natural attractions of the newly merged Thai Nguyen Province. Surrounded by limestone mountains, emerald forests, and rich biodiversity, the lake resembles a peaceful green gem. Visitors can take boat cruises, breathe fresh mountain air, explore hidden grottoes, and immerse in untouched tranquility.',
    descVi: 'Một trong những thắng cảnh thiên nhiên ấn tượng nhất của tỉnh Thái Nguyên mới sau sáp nhập. Được bao bọc bởi những dãy núi đá vôi hùng vĩ, rừng nguyên sinh và hệ sinh thái đa dạng, hồ như một viên ngọc bích êm đềm giữa đại ngàn. Du khách có thể du thuyền ngắm cảnh, tận hưởng không khí trong lành và khám phá vẻ đẹp hoang sơ.',
    highlightsEn: ['Scenic boat cruise', 'Biodiversity hotspot', 'Limestone karst backdrop', 'Homestays in Pac Ngoi village'],
    highlightsVi: ['Du thuyền lướt sóng', 'Đa dạng sinh học phong phú', 'Vách núi đá vôi kỳ vĩ', 'Homestay bản Pác Ngòi'],
    idealSeasonEn: 'Summer & Autumn (May - Nov)',
    idealSeasonVi: 'Mùa hè & Mùa thu (Tháng 5 - 11)',
    author: 'Thu'
  },
  {
    id: 'puong-cave',
    category: 'cave',
    nameEn: 'Puong Cave',
    nameVi: 'Động Puông',
    tagEn: 'Subterranean River & Bats',
    tagVi: 'Hang sông ngầm & Đàn dơi kỳ thú',
    locationEn: 'Nang River, Ba Be Region',
    locationVi: 'Dòng sông Năng, Vùng Ba Bể',
    image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1000&q=80',
    descEn: 'A magical geological wonder where the Nang River pierces straight through the heart of the Lung Nham limestone mountain. Visitors take wooden boats through the 300m cave passage, admiring dramatic karst towers, towering stalactites, and thousands of bats nesting in the high cavern domes.',
    descVi: 'Kỳ quan địa chất độc đáo nơi dòng sông Năng chảy xuyên qua lòng dãy núi đá vôi Lũng Nham. Du khách ngồi thuyền luồn qua hang dài 300m, chiêm ngưỡng những vòm đá hùng vĩ, thạch nhũ muôn hình và hàng vạn chú dơi cư ngụ trên vòm đá cao.',
    highlightsEn: ['300m boat voyage inside mountain', 'Thousands of nesting bats', 'Massive stalactite formations'],
    highlightsVi: ['Hành trình thuyền ngầm 300m', 'Hàng vạn cá thể dơi tự nhiên', 'Thạch nhũ đá vôi kỳ vĩ'],
    idealSeasonEn: 'Year-round, best in Autumn',
    idealSeasonVi: 'Quanh năm, đẹp nhất mùa thu',
    author: 'Thu'
  },
  {
    id: 'hua-ma-cave',
    category: 'cave',
    nameEn: 'Hua Ma Cave',
    nameVi: 'Động Hua Mạ',
    tagEn: 'Subterranean Palace',
    tagVi: 'Cung điện trong lòng núi',
    locationEn: 'Quang Khe, Ba Be Area',
    locationVi: 'Quảng Khê, Khu vực Ba Bể',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80',
    descEn: 'Famous for its awe-inspiring stalactites and stalagmites sculpted over millions of years. Resting high on Leo Pen mountain, Hua Ma reveals a 700-meter deep cathedral-like chamber with stone lotus pedestals, Avalokiteshvara statues, and cooling subterranean air.',
    descVi: 'Nổi tiếng với thế giới nhũ đá và măng đá tráng lệ được thiên nhiên tạc qua hàng triệu năm. Nằm ở lưng chừng núi Lèo Pèn, động mở ra lòng hang sâu 700m rộng lớn như một thánh đường kỳ ảo với các trụ đá tựa tòa sen, tượng Phật Bà và luồng gió mát rượi.',
    highlightsEn: ['Colossal stalagmite chambers', 'Natural stone lotus shapes', 'Mythological mountain setting'],
    highlightsVi: ['Vòm hang thạch nhũ đồ sộ', 'Thạch nhũ hình tòa sen tự nhiên', 'Không gian huyền thoại kỳ bí'],
    idealSeasonEn: 'All seasons, dry in Winter/Spring',
    idealSeasonVi: 'Bốn mùa, khô ráo vào Đông - Xuân',
    author: 'Thu'
  },
  {
    id: 'dau-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Dau Dang Waterfall',
    nameVi: 'Thác Đầu Đẳng',
    tagEn: 'Wild River Rapids',
    tagVi: 'Ghềnh thác đại ngàn',
    locationEn: 'Nang River border, Ba Be',
    locationVi: 'Dòng sông Năng, Ba Bể',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80',
    descEn: 'Where the Nang River encounters hundreds of giant limestone boulders, tumbling over a 500m rocky staircase into a roar of sparkling white foam. Set in untouched primeval forests, Dau Dang represents the raw and untamed power of northern mountains.',
    descVi: 'Nơi dòng sông Năng gặp ghềnh đá vôi khổng lồ, đổ dốc qua quãng dài hơn 500m tạo thành dải bọt tuyết trắng xóa giữa rừng đại ngàn. Tiếng nước gầm vang dội cùng cảnh sắc hoang sơ mang lại trải nghiệm đầy phấn khích cho người yêu thiên nhiên.',
    highlightsEn: ['500m rocky cascades', 'Rare giant fish habitat (Ca chien)', 'Primeval forest trails'],
    highlightsVi: ['Dãy ghềnh đá dài 500m', 'Môi trường sống của cá chiên quý hiếm', 'Đường mòn xuyên rừng nguyên sinh'],
    idealSeasonEn: 'Summer & Early Autumn (June - Oct)',
    idealSeasonVi: 'Mùa hè & Đầu thu (Tháng 6 - 10)',
    author: 'Thu'
  },
  {
    id: 'phuong-hoang-moga',
    category: 'cave',
    nameEn: 'Phuong Hoang Cave & Mo Ga Stream',
    nameVi: 'Hang Phượng Hoàng & Suối Mỏ Gà',
    tagEn: 'Adventure & Refreshment',
    tagVi: 'Kỳ quan Hang động & Suối mát',
    locationEn: 'Vo Nhai District',
    locationVi: 'Huyện Võ Nhai, Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    descEn: 'A breathtaking twin marvel in Vo Nhai. High up the mountain lies Phuong Hoang Cave, renowned for its massive caverns and phoenix-shaped stalagmite. At the base, Mo Ga stream gushes from a subterranean rock cavity with crystal-clear, icy cold water perfect for cooling off on hot summer days.',
    descVi: 'Tuyệt tác thiên nhiên kết hợp giữa núi cao và suối nguồn tại Võ Nhai. Lên cao là hang Phượng Hoàng kỳ vĩ với thạch nhũ hình đôi chim phượng hoàng dang cánh; dưới chân núi là mó nước suối Mỏ Gà tuôn trào mát lạnh trong veo, điểm dừng chân lý tưởng ngày hè.',
    highlightsEn: ['Phoenix stalagmite formation', 'Ice-cool natural pool for swimming', 'Panoramic valley view'],
    highlightsVi: ['Nhũ đá hình chim Phượng Hoàng', 'Bể bơi tự nhiên trong vắt mát lạnh', 'Tầm nhìn bao quát thung lũng'],
    idealSeasonEn: 'Summer & Autumn (May - Oct)',
    idealSeasonVi: 'Mùa hè & Mùa thu (Tháng 5 - 10)',
    author: 'Thu'
  },
  {
    id: 'na-dang-waterfall',
    category: 'waterfall',
    nameEn: 'Na Dang Waterfall',
    nameVi: 'Thác Nà Đăng',
    tagEn: 'Hidden Cascades',
    tagVi: 'Dải lụa trắng ẩn mình',
    locationEn: 'Northern Thai Nguyen Forest Area',
    locationVi: 'Khu vực rừng núi phía Bắc Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1000&q=80',
    descEn: 'A pristine multi-tiered waterfall cascading down vertical cliffs amidst emerald green canopies. Relatively secluded from commercial tourism, Na Dang offers a tranquil sanctuary for hikers, nature photographers, and quiet forest picnics.',
    descVi: 'Ngọn thác nhiều tầng hoang sơ đổ xuống từ vách đá dựng đứng giữa rừng cây xanh mướt. Nhờ giữ trọn vẻ đẹp tự nhiên không xô bồ, Nà Đăng là chốn dừng chân thanh bình tuyệt đối cho những chuyến dã ngoại, chụp ảnh và tận hưởng thiên nhiên thuần khiết.',
    highlightsEn: ['Multi-tiered waterfall streams', 'Untouched natural ambiance', 'Ideal picnic & photo spot'],
    highlightsVi: ['Dòng thác đổ tầng mềm mại', 'Không gian nguyên sơ tĩnh lặng', 'Điểm picnic & chụp ảnh tuyệt vời'],
    idealSeasonEn: 'Summer & Autumn',
    idealSeasonVi: 'Mùa hè & Mùa thu',
    author: 'Thu'
  },
  {
    id: 'nui-coc-lake',
    category: 'lake',
    nameEn: 'Nui Coc Lake',
    nameVi: 'Hồ Núi Cốc',
    tagEn: 'Romantic Legendary Haven',
    tagVi: 'Huyền thoại tình yêu lãng mạn',
    locationEn: 'Dai Tu & Thai Nguyen City border',
    locationVi: 'Ranh giới Đại Từ & TP. Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    descEn: 'A famous 2,500-hectare freshwater lake framed by gentle hills and 89 islets. It is immortalized by the touching folk legend of lovers Cong and Coc. Visitors enjoy boat tours, amusement islands, Thuy Thiem grotto, and lakeside relaxation.',
    descVi: 'Hồ nước ngọt nhân tạo rộng hơn 2.500ha với 89 hòn đảo lớn nhỏ nhấp nhô giữa làn nước biếc. Gắn liền với thiên tình sử bi thương đầy lãng mạn của nàng Công và chàng Cốc, nơi đây là điểm nghỉ dưỡng, du ngoạn thuyền buồm và công viên nước nổi tiếng.',
    highlightsEn: ['89 verdant islets', 'Folk legend of Cong & Coc', 'Theme parks & scenic cruises'],
    highlightsVi: ['89 hòn đảo xanh biếc', 'Huyền thoại tình yêu Chàng Cốc Nàng Công', 'Công viên giải trí & du thuyền'],
    idealSeasonEn: 'Spring, Summer & Autumn',
    idealSeasonVi: 'Mùa xuân, hè & thu',
    author: 'Thu'
  },
  {
    id: 'tan-cuong-tea-hills',
    category: 'tea',
    nameEn: 'Tan Cuong Tea Hills',
    nameVi: 'Vùng chè Tân Cương',
    tagEn: 'The Tea Capital of Vietnam',
    tagVi: 'Đệ nhất Danh trà Việt Nam',
    locationEn: 'Tan Cuong Ward/Commune, Thai Nguyen',
    locationVi: 'Xã/Phường Tân Cương, Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
    descEn: 'The pride of Thai Nguyen with over 22,000 hectares of tea across the province. Tan Cuong features endless undulating emerald hills where world-class green tea is harvested. Visitors walk among fragrant tea rows, witness traditional roasting, and savor the signature honey-sweet finish of Tan Cuong brew.',
    descVi: 'Niềm tự hào của vùng đất danh trà với hơn 22.000 ha chè toàn tỉnh. Tân Cương trải dài những nương chè mâm xôi uốn lượn xanh mướt ngút ngàn. Du khách được tự tay hái búp chè một tôm hai lá, xem nghệ nhân sao chè thủ công và thưởng thức tách trà nồng đượm ngọt hậu.',
    highlightsEn: ['Endless emerald tea terraces', 'Traditional artisan pan-roasting', 'High-end tea tasting masterclasses'],
    highlightsVi: ['Nương chè mâm xôi ngút ngàn', 'Quy trình sao chè thủ công', 'Thưởng trà & nghệ thuật trà Việt'],
    idealSeasonEn: 'Year-round, best in Spring & Autumn',
    idealSeasonVi: 'Quanh năm, đẹp nhất Xuân & Thu',
    author: 'Thu'
  },
  {
    id: 'cua-tu-stream',
    category: 'trekking',
    nameEn: 'Cua Tu Stream',
    nameVi: 'Suối Cửa Tử',
    tagEn: 'Trekking & Canyon Adventure',
    tagVi: 'Thiên đường trekking hẻm núi',
    locationEn: 'Hoang Nong, Dai Tu District',
    locationVi: 'Xã Hoàng Nông, Huyện Đại Từ',
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80',
    descEn: 'Tucked beneath the eastern flank of the Tam Dao mountain range, Cua Tu is a dreamland for thrill-seekers. It features seven distinct "doors" (canyons), roaring waterfalls, deep natural plunge pools, and moss-covered rock corridors for canyoning and wild trekking.',
    descVi: 'Ẩn mình dưới sườn đông dãy Tam Đảo, suối Cửa Tử là thiên đường cho những người mê xê dịch mạo hiểm. Dòng suối qua 7 "cửa" với các vách đá dựng đứng, thác nước cuồn cuộn, máng trượt đá tự nhiên và những vũng nước sâu xanh như ngọc bích.',
    highlightsEn: ['7 adventure canyon gates', 'Natural stone water slides', 'Deep emerald swimming pools'],
    highlightsVi: ['7 cửa ải trekking thử thách', 'Máng trượt nước bằng đá tự nhiên', 'Vũng bơi sâu ngọc bích tuyệt đẹp'],
    idealSeasonEn: 'Summer & Autumn (May - Sep)',
    idealSeasonVi: 'Mùa hè & Mùa thu (Tháng 5 - 9)',
    author: 'Thu'
  }
];

const PAGODAS = [
  {
    id: 'phu-lien-pagoda',
    nameEn: 'Phu Lien Pagoda (Phù Chân Thiền Tự)',
    nameVi: 'Chùa Phù Liễn (Phù Chân Thiền Tự)',
    tagEn: 'Guarding Truth & Righteousness',
    tagVi: 'Phò chân chính - Che chở đạo nghĩa',
    locationEn: 'Hoang Van Thu Ward, Thai Nguyen City',
    locationVi: 'Phường Hoàng Văn Thụ, TP. Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=1000&q=80',
    historyEn: 'Named after the historic Phu Lien Village established during the Ly Dynasty. In 1896, the French colonial administration relocated the pagoda to its present hilltop site. During the anti-French resistance, the pagoda bravely sheltered insurgent fighters loyal to national heroes Hoang Hoa Tham and Doi Can. It houses the revered golden plaque "Linh Son Phuc Dia" (Sacred Mountain & Blessed Land).',
    historyVi: 'Mang tên làng Phù Liễn có từ thời Lý (Phù Liên Hương). Năm 1896, thực dân Pháp chuyển chùa về vị trí đồi cao hiện nay. Trong phong trào chống Pháp, chùa từng là cơ sở bí mật nuôi giấu nghĩa quân của Hoàng Hoa Thám và Đội Cấn. Chùa lưu giữ bức đại tự thếp vàng "Linh Sơn Phúc Địa" (Núi thiêng đất phúc).',
    highlightsEn: [
      'Main Sanctuary (Tam Bảo Hall) with golden plaque "Linh Son Phuc Dia"',
      'Mother Goddess Shrine (Điện Mẫu) honoring Tam Phủ beliefs',
      'Patriarchs’ Hall (Nhà Thờ Tổ) honoring founding masters',
      'Compassionate outdoor Avalokiteshvara (Guanyin) statue',
      'Ancient Stupa Garden with ancestral ashes',
      'Thai Nguyen Provincial Buddhist Executive Board Headquarters'
    ],
    highlightsVi: [
      'Tòa Tam Bảo trang nghiêm với bức hoành phi "Linh Sơn Phúc Địa"',
      'Điện Mẫu thờ tín ngưỡng thờ Mẫu Tam Phủ',
      'Nhà Thờ Tổ tôn vinh các bậc tiền bối khai sơn phá thạch',
      'Tượng Phật Bà Quan Âm lộ thiên uy nghiêm từ bi',
      'Vườn tháp cổ lưu giữ xá lị các đời trụ trì',
      'Trụ sở Ban Trị sự Giáo hội Phật giáo Việt Nam tỉnh Thái Nguyên'
    ],
    festivalEn: 'Annual Spring Festival on the 12th day of the 1st lunar month (cockfighting, bamboo swinging, Chinese chess).',
    festivalVi: 'Lễ hội chùa ngày 12 tháng Giêng âm lịch (chọi gà, đu tre, cờ người).',
    tipsEn: [
      'Attire: Modest clothing covering shoulders & knees. Remove hats & sunglasses before entering halls.',
      'Entry etiquette: Enter through right gate (Right Awareness), exit through left gate (Liberation). Never step on the threshold.',
      'Offerings: Strictly vegetarian (fresh flowers, ripe fruit, incense, cakes). Light incense at courtyard burners only.',
      'Preserve calm: Walk softly, speak quietly, do not touch sacred statues or ritual bronzes.'
    ],
    tipsVi: [
      'Trang phục: Kín đáo, lịch sự, che vai và đầu gối. Tháo mũ, kính râm trước khi bước vào điện thờ.',
      'Lối ra vào: Đi vào cửa phải (cửa Giác quan), đi ra cửa trái (cửa Giải thoát). Tuyệt đối không dẫm chân lên bậu cửa.',
      'Đồ lễ: Chỉ dâng lễ chay (hoa tươi, quả chín, hương thơm, oản chay). Thắp hương tại lư hương lớn ngoài sân.',
      'Giữ thanh tịnh: Đi nhẹ nói khẽ, không chạm tay vào tượng Phật hay pháp khí cổ.'
    ],
    souvenirsEn: 'High-grade Tan Cuong tea, agarwood prayer beads, Buddhist lucky charms, spiritual scriptures.',
    souvenirsVi: 'Trà Tân Cương thượng hạng, chuỗi tràng hạt bồ đề, bùa may mắn bình an, kinh sách Phật giáo.',
    author: 'Ánh'
  },
  {
    id: 'duom-temple',
    nameEn: 'Duom Temple (Đền Đuổm)',
    nameVi: 'Đền Đuổm (Dương Tự Minh Từ)',
    tagEn: 'National Relic & Intangible Heritage',
    tagVi: 'Di tích Quốc gia & Di sản Phi vật thể',
    locationEn: 'Dong Dat, Phu Luong (25km north of City on Route 3)',
    locationVi: 'Xã Động Đạt, Huyện Phú Lương (Km 25 QL3)',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    historyEn: 'Built in 1180 under King Ly Cao Tong at the base of the sacred six-peaked Duom Mountain. The site features the classic four geomantic guardians (Vermilion Bird, Black Tortoise, Azure Dragon, White Tiger). The temple honors General Duong Tu Minh, the heroic Tay leader and Royal Son-in-law (Pho Ma Do Uy) who safeguarded the northern border and married Princess Dien Binh and Princess Thieu Dung.',
    historyVi: 'Khởi dựng năm 1180 triều vua Lý Cao Tông dưới chân núi Điểm Sơn 6 ngọn sừng sững, đắc địa tứ tượng phong thủy (Tả Thanh Long, Hữu Bạch Hổ, Tiền Chu Tước, Hậu Huyền Vũ). Đền phụng thờ Đức Thánh Đuổm Dương Tự Minh - thủ lĩnh người Tày tài đức, Phò mã Đô úy triều Lý đã có công giữ vững biên cương và được gả hai công chúa Diên Bình, Thiều Dung.',
    highlightsEn: [
      'Lower Temple (Đền Hạ): Dedicated to Royal Wives Princess Dien Binh & Princess Thieu Dung',
      'Middle Temple (Đền Trung): Main shrine honoring General Duong Tu Minh',
      'Upper Temple (Đền Thượng): Perched on the limestone mountain cliff, honoring the General’s mother',
      'Tam Quan Gate & Ancient Bell Tower: Traditional East Asian woodwork and scenic courtyard',
      'Duom Mountain Rock Formations: Majestic cliffs shaped like kneeling elephants and dragon heads'
    ],
    highlightsVi: [
      'Đền Hạ: Thờ hai vị phu nhân là Công chúa Diên Bình và Công chúa Thiều Dung',
      'Đền Trung: Cung điện chính thờ Phò mã Đô úy Dương Tự Minh',
      'Đền Thượng: Nằm chót vót áp sát vách đá núi Đuổm thờ Thánh Mẫu (mẹ tướng quân)',
      'Cổng Tam Quan & Lầu Chuông: Kiến trúc gỗ cổ kính uy nghiêm giữa vườn cây cổ thụ',
      'Cảnh sắc núi Đuổm (Điểm Sơn): Vách đá hình voi phục hổ quỳ linh thiêng trầm mặc'
    ],
    festivalEn: 'Duom Temple Festival on the 5th - 6th days of the 1st lunar month (National Intangible Cultural Heritage).',
    festivalVi: 'Lễ hội Đền Đuổm ngày mùng 5 và 6 tháng Giêng âm lịch (Di sản Văn hóa Phi vật thể Quốc gia).',
    tipsEn: [
      'Worship sequence: Bottom to top (Lower Temple -> Middle Temple -> Upper Temple on cliff).',
      'Footwear: Wear sturdy walking shoes or sneakers; stone stairs leading to Upper Temple are steep.',
      'Transportation: 25 km from city center on National Highway 3 (Thai Nguyen - Dinh Hoa / Cho Moi bus available). Large parking on site.',
      'Respect: Do not climb on sacred natural rock formations (kneeling elephant rocks).'
    ],
    tipsVi: [
      'Thứ tự hành lễ: Chiêm bái từ thấp lên cao (Đền Hạ -> Đền Trung -> leo bậc đá lên Đền Thượng).',
      'Giày dép: Mang giày thể thao có độ bám tốt vì bậc đá lên Đền Thượng khá dốc.',
      'Đường đi: Cách trung tâm 25km dọc Quốc lộ 3 (có tuyến xe bus Thái Nguyên - Định Hóa, Chợ Mới). Bãi đỗ xe rộng rãi.',
      'Tôn kính: Không leo trèo lên các mỏm đá tự nhiên mang hình dáng linh vật voi phục, đầu rồng.'
    ],
    souvenirsEn: 'Phu Luong tea, Tan Cuong green tea, black olives (trám đen), dried forest bamboo shoots, Com Lam (bamboo sticky rice), Tay & Nung handmade brocade.',
    souvenirsVi: 'Trà xanh Phú Lương, chè Tân Cương, trám đen Hà Châu, măng khô đại ngàn, cơm lam nếp nương, vải thổ cẩm Tày - Nùng.',
    author: 'Ánh'
  },
  {
    id: 'chua-hang',
    nameEn: 'Chua Hang (Kim Son Tu / Cave Pagoda)',
    nameVi: 'Chùa Hang (Kim Sơn Tự)',
    tagEn: 'Cave Sanctuary of Long Co Mountain',
    tagVi: 'Chốn bồng lai trong lòng núi Long Cổ',
    locationEn: 'Chua Hang Ward, Thai Nguyen City',
    locationVi: 'Phường Chùa Hang, TP. Thái Nguyên',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    historyEn: 'Established around the 11th century under the Ly Dynasty, Chua Hang is nestled inside the limestone caverns of Long Co Mountain. During the French and American resistance wars, the immense dry caves served as an unassailable storage base for ammunition, grain, and temporary command headquarters. In 1999, it was certified as a National Historical & Scenic Relic.',
    historyVi: 'Khởi dựng từ thế kỷ XI thời Lý, Chùa Hang tọa lạc trọn vẹn trong lòng ba vòm hang động núi đá vôi Long Cổ. Trong hai cuộc kháng chiến chống Pháp và chống Mỹ, hang chùa từng là kho đạn dược, lương thực và cơ quan sơ tán an toàn tuyệt mật của Trung ương và tỉnh. Năm 1999, chùa được xếp hạng Di tích Lịch sử Danh lam Thắng cảnh cấp Quốc gia.',
    highlightsEn: [
      'Main Cave Sanctuary (Chùa Hang Trong - Động Kim Sơn): Golden altars beneath thousand-year stone stalactites',
      'Outer Pagoda & Upper Shrine (Chùa Hang Ngoài): Traditional timber shrines on mountain terrace',
      'Patriarchs’ Hall & Mother Goddess Shrine (Nhà Tổ & Điện Mẫu): Deep cultural spirituality',
      'Bell & Drum Towers: Nestled peacefully among mountain trees',
      'Long Co Peak Viewpoint: Panoramic vista of Chua Hang Ward, Cau River, and tea-bearing hills'
    ],
    highlightsVi: [
      'Chùa Hang Trong (Động Kim Sơn): Cung Tam Bảo huyền bí dưới vòm thạch nhũ buông rủ ngàn năm',
      'Chùa Hang Ngoài & Chùa Trên: Quần thể đền chùa gỗ đá uy nghiêm dưới tán cây rừng',
      'Nhà Tổ & Điện Mẫu Tam Phủ: Điểm tựa tâm linh sâu sắc của nhân dân địa phương',
      'Lầu Chuông - Lầu Trống: Hòa quyện giữa sắc xanh của núi rừng',
      'Đỉnh núi Long Cổ: Điểm ngắm toàn cảnh sông Cầu uốn lượn và TP. Thái Nguyên tuyệt đẹp'
    ],
    festivalEn: 'Spring Festival from the 19th to the 21st day of the 1st lunar month.',
    festivalVi: 'Lễ hội Xuân Chùa Hang từ ngày 19 đến 21 tháng Giêng âm lịch.',
    tipsEn: [
      'Cave conditions: Cave floor can be moist; wear shoes with good grip. Keep phone flashlight handy for side grottos.',
      'Safety: Mind low-hanging stalactites; never break or touch wet formations.',
      'Incense: Light incense outside at main courtyard burner to maintain fresh cave oxygen.',
      'Convenience: Only 3 - 5 km from city center; readily accessible by taxi, car, or motorbike.'
    ],
    tipsVi: [
      'Nền hang đá: Có thể ẩm ướt trơn trượt, nên đi giày chống trượt. Bật đèn flash điện thoại khi khám phá ngách phụ.',
      'An toàn: Chú ý vòm đá thấp, tuyệt đối không bẻ hoặc sờ vào thạch nhũ đang phát triển.',
      'Thắp hương: Thắp hương ngoài sân để giữ không khí trong lành, thoáng đãng trong lòng động.',
      'Vị trí: Chỉ cách trung tâm thành phố 3-5 km, đi taxi hoặc xe máy vô cùng thuận tiện.'
    ],
    souvenirsEn: 'Tân Cương Tea, famous Bánh Chưng Bờ Đậu (traditional square sticky rice cake), Cơm Lam, lucky bracelets, stone carvings.',
    souvenirsVi: 'Trà Tân Cương, Bánh chưng Bờ Đậu trứ danh, cơm lam nếp mới, chuỗi vòng may mắn, đồ lưu niệm thủ công.',
    author: 'Ánh'
  }
];

const HOSPITALS = [
  {
    id: 'bv-dk-tw-tn',
    nameEn: 'Thai Nguyen National General Hospital',
    nameVi: 'Bệnh viện Đa khoa Trung ương Thái Nguyên',
    typeEn: 'Special-Class National Hospital',
    typeVi: 'Bệnh viện Đa khoa Hạng Đặc biệt (Bộ Y tế)',
    descEn: 'Founded in 1951, one of only six special-class hospitals in Vietnam. With over 2,050 beds, it provides state-of-the-art emergency, surgical, kidney transplant, heart surgery, and IVF care for the entire northern mountainous region.',
    descVi: 'Thành lập năm 1951, 1 trong 6 bệnh viện hạng đặc biệt toàn quốc trực thuộc Bộ Y tế. Quy mô hơn 2.050 giường bệnh, làm chủ kỹ thuật cao: ghép thận, phẫu thuật tim mạch mở/kín, can thiệp mạch máu, thụ tinh nhân tạo IVF.',
    address: '479 Luong Ngoc Quyen, Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0280 3855 125',
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
    descEn: 'Over 60 years of history on Quang Trung Street. Specializes in obstetrics, pediatrics, internal medicine, surgery, and regional healthcare.',
    descVi: 'Hơn 60 năm xây dựng và phát triển trên đường Quang Trung, phường Thịnh Đán. Mũi nhọn chuyên sâu về sản phụ khoa, nhi khoa, ngoại tổng hợp và chăm sóc sức khỏe cộng đồng.',
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
    descEn: 'Formerly Thai Nguyen City Medical Center, located in Phan Dinh Phung Ward. Provides specialized diagnostic, pulmonary, and community treatments.',
    descVi: 'Tiền thân là Trung tâm Y tế TP. Thái Nguyên tại phường Phan Đình Phùng, thực hiện khám chữa bệnh chuyên sâu và chăm sóc sức khỏe nhân dân.',
    address: 'Phan Dinh Phung Ward, Thai Nguyen City',
    phone: '0208 3856 211',
    emergency: '0208 3856 211',
    area: 'city',
    author: 'Thủy'
  },
  {
    id: 'dinh-hoa-hospital',
    nameEn: 'Dinh Hoa General Hospital',
    nameVi: 'Bệnh viện Đa khoa Huyện Định Hóa',
    typeEn: 'Regional & ATK Base Hospital',
    typeVi: 'Bệnh viện Đa khoa Tuyến Huyện (Vùng ATK)',
    descEn: 'Established Oct 2, 2008 under Decision 2347/QD-UBND. Equipped with 75+ beds, ensuring medical security and first aid for residents and tourists visiting the Dinh Hoa Historical Safe Zone (ATK).',
    descVi: 'Thành lập ngày 02/10/2008 theo QĐ 2347/QĐ-UBND tỉnh Thái Nguyên. Quy mô 75 giường bệnh, đảm bảo chăm sóc sức khỏe và cấp cứu du khách tham quan Khu di tích Lịch sử ATK Định Hóa.',
    address: 'Cho Chu Town, Dinh Hoa District',
    phone: '0208 3878 223',
    emergency: '0208 3878 223',
    area: 'dinh-hoa',
    author: 'Thủy'
  },
  {
    id: 'nui-coc-medical',
    nameEn: 'Nui Coc Lake Medical Stations (Phuc Triu & An Khanh)',
    nameVi: 'Trạm Y tế Khu vực Hồ Núi Cốc (Phúc Trìu & An Khánh)',
    typeEn: 'Local First Aid & Tourism Health Outpost',
    typeVi: 'Trạm Y tế Cấp cứu ban đầu khu du lịch',
    descEn: 'Phuc Triu Health Station (East Coast, Thai Nguyen City) & An Khanh Health Station (Dai Tu lakeside area). First responders for routine medical checkups, motion sickness, dehydration, and emergency first aid around Nui Coc Lake.',
    descVi: 'Trạm Y tế Phúc Trìu (Bờ Đông hồ Núi Cốc, TP. Thái Nguyên) & Trạm Y tế An Khánh (huyện Đại Từ kề cận hồ). Trực 24/7 sơ cấp cứu du khách, xử trí say nắng, chấn thương ban đầu khi du lịch hồ.',
    address: 'Phuc Triu Commune (City) & An Khanh Commune (Dai Tu)',
    phone: '0208 3825 119',
    emergency: '0208 3825 119',
    area: 'nui-coc',
    author: 'Thủy'
  }
];

const SEASONS_DATA = {
  spring: {
    temp: '20 - 23°C',
    rainfall: 'Low to Mild drizzle',
    humidity: '82 - 84%',
    descEn: 'Spring (Feb to Apr) brings cool, refreshing breezes and vibrant renewal to northern hills. It is the festival season with Tay-Nung Long Tong rituals and tea bushes sprouting tender young emerald shoots.',
    descVi: 'Mùa xuân (Tháng 2 - 4) tiết trời mát lành, mưa xuân lất phất làm bừng lên sức sống đại ngàn. Đây là mùa trẩy hội tưng bừng khắp bản làng và những đồi chè nhú búp non tơ thơm ngát.',
    activitiesEn: ['Visit Duom Temple & Chua Hang Festivals', 'Tan Cuong Spring tea harvest', 'Ba Be Long Tong boat races'],
    activitiesVi: ['Trẩy hội Đền Đuổm, Chùa Hang, Chùa Phù Liễn', 'Ngắm búp chè xuân Tân Cương', 'Hội Lồng Tồng Ba Bể'],
    packEn: 'Light jacket, umbrella or rain mac, comfortable walking shoes.',
    packVi: 'Áo khoác nhẹ, ô che mưa xuân, giày bệt/thể thao êm ái.'
  },
  summer: {
    temp: '28 - 35°C',
    rainfall: 'High (Frequent rain)',
    humidity: '85 - 88%',
    descEn: 'Summer (May to Aug) is sunny and humid with cooling afternoon rains. Perfect for swimming in emerald mountain streams, navigating shaded river caves, and boat cruises on Ba Be and Nui Coc Lakes.',
    descVi: 'Mùa hè (Tháng 5 - 8) nắng rực rỡ, độ ẩm cao và những cơn mưa rào mát rượi. Là thời điểm hoàn hảo để chèo thuyền trên hồ Ba Bể, ngâm mình dưới suối Cửa Tử và khám phá hang động kỳ bí.',
    activitiesEn: ['Boat trip on Ba Be Lake & Puong Cave', 'Cua Tu canyon trekking & stream swim', 'Nui Coc water theme park'],
    activitiesVi: ['Du ngoạn hồ Ba Bể, khám phá động Puông', 'Trekking suối Cửa Tử, tắm mát Mỏ Gà', 'Vui chơi công viên nước hồ Núi Cốc'],
    packEn: 'Quick-dry clothes, waterproof phone pouch, sun protection, trekking water shoes.',
    packVi: 'Quần áo mau khô, túi chống nước điện thoại, kem chống nắng, giày lội suối.'
  },
  autumn: {
    temp: '22 - 27°C',
    rainfall: 'Moderate to Low',
    humidity: '75 - 80%',
    descEn: 'Autumn (Sep to Nov) is universally hailed as the golden season to visit Thai Nguyen. Crisp, dry, cool air, blue skies, and golden sunlight across green tea slopes make trekking and photography unforgettable.',
    descVi: 'Mùa thu (Tháng 9 - 11) là "mùa vàng" tuyệt đẹp nhất để khám phá Thái Nguyên. Khí hậu dịu mát, trời trong xanh, nắng vàng rót mật trên nương chè, lý tưởng cho trekking và săn ảnh.',
    activitiesEn: ['Photography tours at Tan Cuong tea hills', 'Trekking to Hua Ma Cave & Dau Dang', 'Homestay experience in Tay stilt villages'],
    activitiesVi: ['Chụp ảnh nương chè Tân Cương', 'Trekking động Hua Mạ, thác Đầu Đẳng', 'Trải nghiệm nhà sàn dân tộc Tày'],
    packEn: 'Camera, light layers for evening chill, hat, comfortable hiking boots.',
    packVi: 'Máy ảnh, áo khoác mỏng cho buổi tối, nón mũ, giày leo núi.'
  },
  winter: {
    temp: '13 - 18°C',
    rainfall: 'Low (Dry season)',
    humidity: '70 - 75%',
    descEn: 'Winter (Dec to Feb) is cold and dry, particularly in the northern high mountains. Ideal for cozy culinary exploration, enjoying piping hot Tan Cuong tea, and sitting beside ethnic hearth fires.',
    descVi: 'Mùa đông (Tháng 12 - 2) se lạnh và khô ráo, gió bấc tràn về các bản làng rẻo cao. Thích hợp cho du lịch văn hóa, quây quần bên bếp lửa hồng nhà sàn và nhâm nhi chén trà Tân Cương ấm nóng.',
    activitiesEn: ['Tea tasting workshops & tea masterclasses', 'ATK Dinh Hoa revolutionary relic exploration', 'Sample Banh Chung Bo Dau & Com Lam by fireside'],
    activitiesVi: ['Thưởng trà nóng và học trà đạo', 'Thăm An toàn khu (ATK) Định Hóa', 'Thưởng thức bánh chưng Bờ Đậu, cơm lam bên bếp than'],
    packEn: 'Warm winter coat, scarf, thermal layers, moisturiser.',
    packVi: 'Áo khoác ấm, khăn quàng cổ, trang phục giữ nhiệt.'
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

  // Update toggle button text
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.innerHTML = state.lang === 'en' 
      ? '<span class="text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">EN</span> <span class="text-xs text-slate-500 font-medium">VI</span>'
      : '<span class="text-xs text-slate-500 font-medium">EN</span> <span class="text-xs font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">VI</span>';
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

// --- RENDER DESTINATIONS ---
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
      <div class="col-span-full py-16 text-center text-slate-500">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-lg font-medium">${state.lang === 'en' ? 'No destinations found matching your search.' : 'Không tìm thấy điểm đến nào phù hợp.'}</p>
        <button onclick="resetFilters()" class="mt-4 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
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
    const loc = state.lang === 'vi' ? item.locationVi : item.locationEn;
    const season = state.lang === 'vi' ? item.idealSeasonVi : item.idealSeasonEn;
    const isSaved = state.savedPlaces.some(p => p.id === item.id);

    return `
      <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover border border-slate-100 flex flex-col group">
        <div class="relative h-60 overflow-hidden bg-slate-100">
          <img src="${item.image}" alt="${name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
          
          <span class="absolute top-4 left-4 text-xs font-semibold px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-800 rounded-full shadow-sm">
            ${tag}
          </span>

          <button onclick="toggleSavePlace('${item.id}', event)" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-red-500 shadow-sm transition">
            <svg class="w-5 h-5 ${isSaved ? 'text-red-500 fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          <div class="absolute bottom-3 left-4 right-4 flex items-center text-white/90 text-xs gap-1">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            <span class="truncate">${loc}</span>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">${name}</h3>
              <span class="text-xs text-slate-400">By ${item.author}</span>
            </div>
            <p class="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">${desc}</p>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
              <svg class="w-4 h-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span><strong>${state.lang === 'en' ? 'Best Season:' : 'Mùa lý tưởng:'}</strong> ${season}</span>
            </div>

            <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button onclick="openDestinationModal('${item.id}')" class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                <span>${state.lang === 'en' ? 'View Details' : 'Xem chi tiết'}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
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

  // Update tab buttons
  document.querySelectorAll('.season-btn').forEach(btn => {
    if (btn.getAttribute('data-season') === seasonKey) {
      btn.classList.add('active', 'border-emerald-600', 'text-emerald-700');
    } else {
      btn.classList.remove('active', 'border-emerald-600', 'text-emerald-700');
    }
  });

  const desc = state.lang === 'vi' ? data.descVi : data.descEn;
  const activities = state.lang === 'vi' ? data.activitiesVi : data.activitiesEn;
  const pack = state.lang === 'vi' ? data.packVi : data.packEn;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
      <div class="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <div>
          <span class="text-xs uppercase tracking-wider font-semibold text-emerald-100">${state.lang === 'en' ? 'Climate Metrics' : 'Chỉ số Khí hậu'}</span>
          <h4 class="text-2xl font-bold mt-1 capitalize">${seasonKey} in Thai Nguyen</h4>
          
          <div class="mt-6 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg class="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                <p class="text-xs text-emerald-100">${state.lang === 'en' ? 'Average Temperature' : 'Nhiệt độ trung bình'}</p>
                <p class="text-lg font-bold">${data.temp}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg class="w-5 h-5 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              </div>
              <div>
                <p class="text-xs text-emerald-100">${state.lang === 'en' ? 'Rainfall Pattern' : 'Lượng mưa đặc trưng'}</p>
                <p class="text-lg font-bold">${data.rainfall}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg class="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
              </div>
              <div>
                <p class="text-xs text-emerald-100">${state.lang === 'en' ? 'Relative Humidity' : 'Độ ẩm không khí'}</p>
                <p class="text-lg font-bold">${data.humidity}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-emerald-400/40 text-xs text-emerald-100 flex items-center justify-between">
          <span>Source: thainguyen.gov.vn</span>
          <span class="font-semibold">Curated by Hương</span>
        </div>
      </div>

      <div class="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h4 class="text-xl font-bold text-slate-900 mb-3">${state.lang === 'en' ? 'Seasonal Highlights & Experience' : 'Trải nghiệm & Điểm nhấn theo mùa'}</h4>
          <p class="text-slate-600 leading-relaxed text-sm mb-6">${desc}</p>

          <h5 class="text-sm font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${state.lang === 'en' ? 'Recommended Activities' : 'Hoạt động trải nghiệm nổi bật'}
          </h5>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            ${activities.map(act => `
              <li class="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span>${act}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200/60 flex items-start gap-3">
          <div class="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div>
            <h6 class="text-xs font-bold text-amber-900 uppercase tracking-wide">${state.lang === 'en' ? 'Packing Advice' : 'Lời khuyên hành trang'}</h6>
            <p class="text-xs text-amber-800 mt-0.5">${pack}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- RENDER PAGODAS & TEMPLES ---
function renderPagodas() {
  const container = document.getElementById('pagodas-grid');
  if (!container) return;

  container.innerHTML = PAGODAS.map(item => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const tag = state.lang === 'vi' ? item.tagVi : item.tagEn;
    const history = state.lang === 'vi' ? item.historyVi : item.historyEn;
    const loc = state.lang === 'vi' ? item.locationVi : item.locationEn;
    const highlights = state.lang === 'vi' ? item.highlightsVi : item.highlightsEn;
    const tips = state.lang === 'vi' ? item.tipsVi : item.tipsEn;
    const souvenirs = state.lang === 'vi' ? item.souvenirsVi : item.souvenirsEn;
    const festival = state.lang === 'vi' ? item.festivalVi : item.festivalEn;

    return `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col lg:flex-row">
        <div class="lg:w-2/5 relative min-h-[300px] lg:min-h-full">
          <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
          
          <div class="absolute top-4 left-4">
            <span class="text-xs font-bold px-3 py-1 bg-amber-500 text-slate-950 rounded-full shadow-md uppercase tracking-wider">
              ${tag}
            </span>
          </div>

          <div class="absolute bottom-6 left-6 right-6 text-white">
            <span class="text-xs text-amber-300 font-semibold tracking-wide uppercase">Curated by ${item.author}</span>
            <h3 class="text-2xl font-bold font-ancient mt-1 text-white">${name}</h3>
            <p class="text-xs text-slate-300 mt-1 flex items-center gap-1">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${loc}</span>
            </p>
          </div>
        </div>

        <div class="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-700">${state.lang === 'en' ? 'Historical Significance' : 'Ý nghĩa Lịch sử & Huyền tích'}</h4>
              <p class="text-slate-600 text-sm mt-1.5 leading-relaxed">${history}</p>
            </div>

            <div class="mb-4">
              <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-700">${state.lang === 'en' ? 'Key Shrines & Sights' : 'Điểm tham quan & Chiêm bái'}</h4>
              <ul class="mt-2 space-y-1.5 text-xs text-slate-700">
                ${highlights.slice(0, 4).map(hl => `
                  <li class="flex items-start gap-2">
                    <span class="text-amber-500 font-bold shrink-0">❖</span>
                    <span>${hl}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-900 mb-4">
              <strong>🎉 ${state.lang === 'en' ? 'Festival:' : 'Lễ hội:'}</strong> ${festival}
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                ${state.lang === 'en' ? 'Visitor Etiquette & Tips' : 'Quy tắc Hành lễ & Lưu ý'}
              </h4>
              <ul class="mt-2 space-y-1 text-xs text-slate-600">
                ${tips.slice(0, 3).map(tip => `
                  <li class="flex items-start gap-1.5">
                    <span class="text-slate-400">•</span>
                    <span>${tip}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="text-slate-500">
              <strong class="text-slate-700">🎁 ${state.lang === 'en' ? 'Souvenirs:' : 'Quà lưu niệm:'}</strong> ${souvenirs}
            </div>
            <button onclick="toggleSavePlace('${item.id}', event)" class="shrink-0 px-4 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl transition font-medium">
              ${state.savedPlaces.some(p => p.id === item.id) 
                ? (state.lang === 'en' ? '✓ Saved' : '✓ Đã lưu') 
                : (state.lang === 'en' ? '+ Add to Wishlist' : '+ Lưu vào hành trình')}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- RENDER HOSPITALS ---
function renderHospitals() {
  const container = document.getElementById('hospitals-grid');
  if (!container) return;

  container.innerHTML = HOSPITALS.map(item => {
    const name = state.lang === 'vi' ? item.nameVi : item.nameEn;
    const type = state.lang === 'vi' ? item.typeVi : item.typeEn;
    const desc = state.lang === 'vi' ? item.descVi : item.descEn;

    return `
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-800 rounded-md border border-teal-200">
              ${type}
            </span>
            <span class="text-xs text-slate-400">By ${item.author}</span>
          </div>

          <h4 class="text-lg font-bold text-slate-900 mt-2">${name}</h4>
          <p class="text-slate-600 text-xs mt-2 leading-relaxed">${desc}</p>

          <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
              <span>${item.address}</span>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span><strong>Hotline:</strong> ${item.phone}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <a href="tel:${item.phone.replace(/[^0-9]/g, '')}" class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold text-center transition flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span>${state.lang === 'en' ? 'Call Now' : 'Gọi cấp cứu'}</span>
          </a>
          <button onclick="copyToClipboard('${item.phone}', '${state.lang === 'en' ? 'Phone number copied!' : 'Đã sao chép số điện thoại!'}')" class="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition" title="Copy Number">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- DESTINATION MODAL ---
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
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
      
      <button onclick="closeDestinationModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="absolute bottom-6 left-6 right-6 text-white">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-3 py-1 bg-emerald-600 text-xs font-semibold rounded-full">${tag}</span>
          <span class="text-xs text-slate-300">Curated by ${item.author}</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white">${name}</h2>
        <p class="text-sm text-slate-300 flex items-center gap-1.5 mt-1">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          <span>${loc}</span>
        </p>
      </div>
    </div>

    <div class="p-6 md:p-8 space-y-6">
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-700">${state.lang === 'en' ? 'Overview & Experience' : 'Tổng quan & Trải nghiệm'}</h4>
        <p class="text-slate-700 text-sm md:text-base leading-relaxed mt-2">${desc}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">${state.lang === 'en' ? 'Highlights' : 'Điểm nhấn nổi bật'}</h5>
          <ul class="space-y-1.5 text-xs text-slate-600">
            ${highlights.map(h => `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <h5 class="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">${state.lang === 'en' ? 'Best Time to Visit' : 'Thời điểm lý tưởng nhất'}</h5>
          <p class="text-xs text-amber-800 leading-relaxed">${season}</p>
          <div class="mt-3 text-xs text-amber-900 font-medium flex items-center gap-1">
            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>${state.lang === 'en' ? 'Tip: Check weather before outdoor stream activities!' : 'Lưu ý: Luôn kiểm tra thời tiết trước khi lội suối!'}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onclick="toggleSavePlace('${item.id}'); openDestinationModal('${item.id}');" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border ${isSaved ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'} text-sm font-semibold flex items-center justify-center gap-2 transition">
          <svg class="w-4 h-4 ${isSaved ? 'fill-red-500' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span>${isSaved ? (state.lang === 'en' ? 'Remove from Saved' : 'Xóa khỏi danh sách lưu') : (state.lang === 'en' ? 'Save Destination' : 'Lưu điểm đến này')}</span>
        </button>

        <a href="#itinerary-builder" onclick="closeDestinationModal()" class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition text-center shadow-sm">
          ${state.lang === 'en' ? 'Plan Itinerary With This Spot' : 'Lên kế hoạch với điểm này'}
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

// --- SAVED PLACES / WISHLIST MANAGEMENT ---
function toggleSavePlace(id, event) {
  if (event) event.stopPropagation();

  // Look in both destinations and pagodas
  const target = DESTINATIONS.find(d => d.id === id) || PAGODAS.find(p => p.id === id);
  if (!target) return;

  const index = state.savedPlaces.findIndex(p => p.id === id);
  if (index > -1) {
    state.savedPlaces.splice(index, 1);
    showToast(state.lang === 'en' ? 'Removed from your itinerary list' : 'Đã xóa khỏi danh sách hành trình');
  } else {
    state.savedPlaces.push({
      id: target.id,
      nameEn: target.nameEn,
      nameVi: target.nameVi,
      image: target.image,
      category: target.category || 'spiritual'
    });
    showToast(state.lang === 'en' ? 'Added to your itinerary list!' : 'Đã thêm vào danh sách hành trình!');
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
        <svg class="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        <p class="text-sm">${state.lang === 'en' ? 'You have no saved destinations yet.' : 'Bạn chưa lưu điểm đến nào.'}</p>
        <p class="text-xs text-slate-400 mt-1">${state.lang === 'en' ? 'Click the heart button on any spot to save it here.' : 'Nhấp biểu tượng trái tim ở điểm đến bất kỳ để lưu vào đây.'}</p>
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
            <h5 class="text-sm font-bold text-slate-900">${name}</h5>
            <span class="text-xs text-emerald-700 capitalize">${p.category}</span>
          </div>
        </div>
        <button onclick="toggleSavePlace('${p.id}')" class="text-red-500 hover:text-red-700 p-2" title="Remove">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

// --- WEB AUDIO API PENTATONIC & AMBIENT SOUNDSCAPE SYNTHESIZER ---
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
      showToast('Audio not supported on this device');
      return;
    }

    state.audioCtx = new AudioContext();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    // 1. Create gentle pink noise for stream/breeze ambiance
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.018;
      b6 = white * 0.115926;
    }

    const whiteNoise = state.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it sound like a peaceful mountain stream
    const filter = state.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, state.audioCtx.currentTime);

    const gainNode = state.audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.04, state.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(state.audioCtx.destination);
    whiteNoise.start();
    state.ambientNode = whiteNoise;

    // 2. Play gentle Vietnamese pentatonic bell notes every few seconds (C, D, F, G, A)
    const pentatonicNotes = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25]; // C4, D4, F4, G4, A4, C5
    function playChime() {
      if (!state.soundPlaying || !state.audioCtx) return;
      const osc = state.audioCtx.createOscillator();
      const chimeGain = state.audioCtx.createGain();
      const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

      chimeGain.gain.setValueAtTime(0, state.audioCtx.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.05, state.audioCtx.currentTime + 0.1);
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
    showToast(state.lang === 'en' ? 'Tea garden ambient soundscape playing' : 'Đang phát âm thanh thiên nhiên nương chè');
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
  const waveContainer = document.getElementById('sound-wave-bars');
  const label = document.getElementById('sound-btn-label');
  if (!btn) return;

  if (isPlaying) {
    btn.classList.add('sound-playing', 'bg-emerald-700', 'text-white');
    btn.classList.remove('bg-white/80', 'text-slate-700');
    if (waveContainer) waveContainer.classList.remove('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Sound: On' : 'Âm thanh: Bật';
  } else {
    btn.classList.remove('sound-playing', 'bg-emerald-700', 'text-white');
    btn.classList.add('bg-white/80', 'text-slate-700');
    if (waveContainer) waveContainer.classList.add('hidden');
    if (label) label.textContent = state.lang === 'en' ? 'Tea Soundscape' : 'Âm thanh nương chè';
  }
}

// --- EVENT LISTENERS & UI HELPERS ---
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDestinations();
    });
  }

  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.getAttribute('data-filter') || 'all';
      renderDestinations();
    });
  });

  // Season Buttons
  document.querySelectorAll('.season-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const season = btn.getAttribute('data-season');
      if (season) renderSeasons(season);
    });
  });

  // Reading progress
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const bar = document.getElementById('reading-progress');
    if (bar) bar.style.width = scrolled + '%';

    // Show/Hide back-to-top button
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

  // Mobile menu toggle
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
    toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none flex items-center gap-2 border border-slate-700';
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
      link.classList.remove('text-emerald-700', 'font-bold');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('text-emerald-700', 'font-bold');
      }
    });
  });
}

// Print customized itinerary
function printItinerary() {
  window.print();
}

// Export functions to global scope for HTML onclick attributes
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
