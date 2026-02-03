import { Sector, Combo, Content } from '@/types';

// Real product data from APPE JV Vietnam price list
const MOCK_SECTORS: Sector[] = [
  {
    id: 1,
    name: 'Thức ăn gia súc',
    description: 'Thức ăn hỗn hợp và đậm đặc cho lợn, bò các giai đoạn phát triển',
    image: '',
    list_combos: [
      // Thức ăn hỗn hợp cho lợn
      { id: 1, name: 'HH cho lợn sữa (7 ngày tuổi - 10kg)', price: 27100, description: 'Mã SP: A1 - Đạm 20% - Bao 20kg', image: '', sector_id: 1, product_ids: [1], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 2, name: 'HH cho lợn con tập ăn (10 ngày tuổi - 20kg)', price: 18090, description: 'Mã SP: A2 - Đạm 19% - Bao 25kg', image: '', sector_id: 1, product_ids: [2], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 3, name: 'HH cho lợn con tập ăn (10 ngày tuổi - 25kg)', price: 14640, description: 'Mã SP: A2GP - Đạm 19% - Bao 25kg', image: '', sector_id: 1, product_ids: [3], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 4, name: 'HH cho lợn siêu nạc (10 - 25kg)', price: 12830, description: 'Mã SP: A3 - Đạm 18.5% - Bao 25kg', image: '', sector_id: 1, product_ids: [4], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 5, name: 'HH cho lợn con siêu nạc từ tập ăn - 25kg', price: 12830, description: 'Mã SP: A1020 - Đạm 18.5% - Bao 25kg', image: '', sector_id: 1, product_ids: [5], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 6, name: 'HH cho lợn siêu nạc từ 12 - 30kg', price: 12380, description: 'Mã SP: A1021 - Đạm 18% - Bao 25kg', image: '', sector_id: 1, product_ids: [6], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 7, name: 'HH cho lợn siêu nạc 60kg - xuất chuồng', price: 11400, description: 'Mã SP: A1022SF - Đạm 17% - Bao 25kg', image: '', sector_id: 1, product_ids: [7], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 8, name: 'HH cho lợn nái hậu bị, nái chửa', price: 11130, description: 'Mã SP: A117 - Đạm 14% - Bao 25kg', image: '', sector_id: 1, product_ids: [8], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 9, name: 'HH cho lợn nái nuôi con', price: 13190, description: 'Mã SP: A118 - Đạm 17% - Bao 25kg', image: '', sector_id: 1, product_ids: [9], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 10, name: 'HH cho lợn thịt (15kg - 25kg)', price: 11675, description: 'Mã SP: A1031 - Đạm 17% - Bao 40kg', image: '', sector_id: 1, product_ids: [10], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 11, name: 'HH cho lợn thịt 15kg - 60kg', price: 11225, description: 'Mã SP: A1032 - Đạm 16.5% - Bao 40kg', image: '', sector_id: 1, product_ids: [11], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 12, name: 'HH cho lợn thịt 35kg - 90kg', price: 10775, description: 'Mã SP: A1033 - Đạm 14% - Bao 40kg', image: '', sector_id: 1, product_ids: [12], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 13, name: 'HH cho lợn lai từ 30kg - xuất chuồng', price: 10475, description: 'Mã SP: A1034 - Đạm 13% - Bao 40kg', image: '', sector_id: 1, product_ids: [13], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      // Thức ăn đậm đặc cao cấp cho lợn
      { id: 14, name: 'Đậm đặc cao cấp cho lợn tập ăn - xuất chuồng', price: 18770, description: 'Mã SP: A999 - Đạm 46% - Bao 25kg', image: '', sector_id: 1, product_ids: [14], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      // Thức ăn cho bò
      { id: 15, name: 'HH cho bò thịt', price: 10640, description: 'Mã SP: A618 - Đạm 16% - Bao 25kg', image: '', sector_id: 1, product_ids: [15], created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
    ],
    list_contents: [
      { id: 1, title: 'Hướng dẫn chăn nuôi lợn hiệu quả với thức ăn APPE', content: 'Thức ăn hỗn hợp APPE được nghiên cứu và sản xuất theo công nghệ tiên tiến, đảm bảo cung cấp đầy đủ dinh dưỡng cho lợn ở mọi giai đoạn phát triển. Với hàm lượng đạm từ 13-20%, sản phẩm giúp tối ưu hóa tỷ lệ chuyển đổi thức ăn và tăng trọng nhanh.', image: '', brand: 'APPE JV', category: 'education', sector_id: 1, created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 2, title: 'Lợi ích của thức ăn đậm đặc cao cấp A999', content: 'Thức ăn đậm đặc A999 với hàm lượng đạm lên đến 46% là giải pháp tối ưu cho việc bổ sung dinh dưỡng cho lợn. Sản phẩm giúp cải thiện sức khỏe đường ruột, tăng cường hệ miễn dịch và nâng cao hiệu quả chăn nuôi.', image: '', brand: 'APPE JV', category: 'product', sector_id: 1, created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
      { id: 3, title: 'Quy trình chăn nuôi bò thịt với thức ăn A618', content: 'Thức ăn hỗn hợp A618 dành cho bò thịt được thiết kế đặc biệt với hàm lượng đạm 16%, phù hợp với nhu cầu dinh dưỡng của bò trong giai đoạn nuôi thịt. Sản phẩm giúp bò phát triển khỏe mạnh và đạt trọng lượng xuất chuồng tối ưu.', image: '', brand: 'APPE JV', category: 'guide', sector_id: 1, created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z' },
    ],
    created_at: '2024-05-11T00:00:00Z', updated_at: '2024-05-11T00:00:00Z',
  },
  {
    id: 2,
    name: 'Thức ăn gia cầm',
    description: 'Thức ăn hỗn hợp và đậm đặc cho gà, vịt, ngan các giai đoạn phát triển',
    image: '',
    list_combos: [
      // Thức ăn cho gà công nghiệp
      { id: 16, name: 'HH cho gà công nghiệp 01 - 12 ngày tuổi', price: 13480, description: 'Mã SP: A2010 - Đạm 21% - Bao 25kg', image: '', sector_id: 2, product_ids: [16], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 17, name: 'HH cho gà công nghiệp 13 - 24 ngày tuổi', price: 13180, description: 'Mã SP: A2011 - Đạm 20% - Bao 25kg', image: '', sector_id: 2, product_ids: [17], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 18, name: 'HH cho gà công nghiệp 25 - 39 ngày tuổi', price: 12980, description: 'Mã SP: A2012 - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [18], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 19, name: 'HH gà trắng siêu thịt từ 1-14 ngày tuổi', price: 13500, description: 'Mã SP: L310-S - Đạm 21% - Bao 25kg', image: '', sector_id: 2, product_ids: [19], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 20, name: 'HH gà trắng siêu thịt từ 1-14 ngày tuổi (Cầu trùng)', price: 13500, description: 'Mã SP: L310-S Cầu trùng - Đạm 21% - Bao 25kg', image: '', sector_id: 2, product_ids: [20], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 21, name: 'HH gà trắng siêu thịt từ 15-28 ngày tuổi', price: 13200, description: 'Mã SP: L311-S - Đạm 20% - Bao 25kg', image: '', sector_id: 2, product_ids: [21], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 22, name: 'HH đặc biệt cho gà siêu thịt vỗ béo', price: 13120, description: 'Mã SP: L312-S - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [22], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 23, name: 'HH cho gà trắng 01 - 21 ngày tuổi', price: 13530, description: 'Mã SP: A2010S - Đạm 21% - Bao 25kg', image: '', sector_id: 2, product_ids: [23], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 24, name: 'Hỗn hợp cao cấp cho gà thịt 22 - 42 ngày tuổi', price: 13180, description: 'Mã SP: A2011S - Đạm 19% - Bao 25kg', image: '', sector_id: 2, product_ids: [24], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 25, name: 'Hỗn hợp đặc biệt cho gà thịt vỗ béo', price: 13300, description: 'Mã SP: A2012S - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [25], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      // Thức ăn cho gà ủm
      { id: 26, name: 'HH gà ủm từ 01-21 ngày tuổi', price: 13380, description: 'Mã SP: A2020 - Đạm 20.5% - Bao 25kg', image: '', sector_id: 2, product_ids: [26], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 27, name: 'HH cho gà siêu thịt từ 22-42 ngày tuổi', price: 12830, description: 'Mã SP: A2021 - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [27], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      // Thức ăn cho gà lông màu
      { id: 28, name: 'HH cho gà lông màu 01-28 ngày tuổi', price: 11620, description: 'Mã SP: A2030 - Đạm 19% - Bao 25kg', image: '', sector_id: 2, product_ids: [28], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 29, name: 'HH cho gà thịt 29 ngày tuổi - xuất chuồng', price: 12030, description: 'Mã SP: A2031PLUS - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [29], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 30, name: 'HH cho gà lông màu 01 ngày tuổi - xuất chuồng', price: 10960, description: 'Mã SP: A2033 - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [30], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      // Thức ăn cho gà hậu bị và gà đẻ
      { id: 31, name: 'HH cho gà hậu bị từ 5 - 8 tuần tuổi', price: 10480, description: 'Mã SP: A310 - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [31], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 32, name: 'HH cho gà hậu bị từ 7-18 tuần tuổi', price: 10280, description: 'Mã SP: A311 - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [32], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 33, name: 'HH cho gà đẻ bố mẹ giống', price: 10400, description: 'Mã SP: A312 - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [33], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 34, name: 'HH cho gà đẻ siêu trứng', price: 10080, description: 'Mã SP: A313S - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [34], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 35, name: 'HH cho gà đẻ cao sàn', price: 10280, description: 'Mã SP: A313PLUS - Đạm 17% - Bao 25kg', image: '', sector_id: 2, product_ids: [35], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      // Thức ăn đậm đặc cho gà thịt
      { id: 36, name: 'Đậm đặc cho gà thịt 01 ngày tuổi - xuất chuồng', price: 18450, description: 'Mã SP: A308 - Đạm 43% - Bao 25kg', image: '', sector_id: 2, product_ids: [36], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      // Thức ăn cho vịt, ngan
      { id: 37, name: 'HH cho vịt, ngan con (từ 01 - 21 ngày tuổi)', price: 12360, description: 'Mã SP: L810 - Đạm 20% - Bao 25kg', image: '', sector_id: 2, product_ids: [37], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 38, name: 'HH cho vịt, ngan thịt cao cấp 20 ngày tuổi - xuất chuồng', price: 11540, description: 'Mã SP: A4041S - Đạm 18.5% - Bao 25kg', image: '', sector_id: 2, product_ids: [38], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 39, name: 'HH cho vịt, ngan thịt (20 ngày tuổi - xuất chuồng)', price: 11220, description: 'Mã SP: L811-S - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [39], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 40, name: 'HH cho vịt, ngan dẻ siêu trứng', price: 10025, description: 'Mã SP: L814 - Đạm 19% - Bao 25kg', image: '', sector_id: 2, product_ids: [40], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 41, name: 'HH cho vịt, ngan dẻ trứng', price: 9775, description: 'Mã SP: L815 - Đạm 18% - Bao 25kg', image: '', sector_id: 2, product_ids: [41], created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
    ],
    list_contents: [
      { id: 4, title: 'Hướng dẫn chăn nuôi gà thịt hiệu quả', content: 'Thức ăn hỗn hợp cho gà thịt APPE được phân chia theo từng giai đoạn phát triển, từ gà con 1 ngày tuổi đến xuất chuồng. Với hàm lượng đạm từ 18-21%, sản phẩm đảm bảo gà phát triển đều, tăng trọng nhanh và đạt trọng lượng xuất chuồng tối ưu.', image: '', brand: 'APPE JV', category: 'education', sector_id: 2, created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 5, title: 'Lợi ích của thức ăn đậm đặc A308 cho gà thịt', content: 'Thức ăn đậm đặc A308 với hàm lượng đạm 43% là giải pháp bổ sung dinh dưỡng tối ưu cho gà thịt. Sản phẩm giúp cải thiện tỷ lệ chuyển đổi thức ăn, tăng cường sức đề kháng và nâng cao chất lượng thịt gà.', image: '', brand: 'APPE JV', category: 'product', sector_id: 2, created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 6, title: 'Kỹ thuật chăn nuôi vịt, ngan thịt', content: 'Thức ăn hỗn hợp cho vịt, ngan APPE được thiết kế phù hợp với đặc điểm sinh lý của gia cầm nước. Với công thức dinh dưỡng cân bằng, sản phẩm giúp vịt, ngan phát triển khỏe mạnh và đạt hiệu quả kinh tế cao.', image: '', brand: 'APPE JV', category: 'guide', sector_id: 2, created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
      { id: 7, title: 'Chăn nuôi gà đẻ bền vững với thức ăn APPE', content: 'Thức ăn cho gà đẻ APPE được nghiên cứu đặc biệt để tối ưu hóa năng suất đẻ trứng. Với hàm lượng dinh dưỡng cân bằng, sản phẩm giúp gà đẻ nhiều trứng, trứng to, chất lượng cao và duy trì sức khỏe tốt.', image: '', brand: 'APPE JV', category: 'education', sector_id: 2, created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z' },
    ],
    created_at: '2024-07-15T00:00:00Z', updated_at: '2024-07-15T00:00:00Z',
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSectorService = {
  async getAllSectors(): Promise<Sector[]> { await delay(500); return MOCK_SECTORS; },
  async getSectorById(sectorId: number): Promise<Sector | null> { await delay(400); return MOCK_SECTORS.find(s => s.id === sectorId) || null; },
  async getAllCombos(): Promise<Combo[]> { await delay(500); const combos: Combo[] = []; MOCK_SECTORS.forEach(s => { if (s.list_combos) combos.push(...s.list_combos); }); return combos; },
  async getSectorCombos(sectorId: number): Promise<Combo[]> { await delay(400); const sector = MOCK_SECTORS.find(s => s.id === sectorId); return sector?.list_combos || []; },
  async getAllContents(): Promise<Content[]> { await delay(500); const contents: Content[] = []; MOCK_SECTORS.forEach(s => { if (s.list_contents) contents.push(...s.list_contents); }); return contents; },
};

export default mockSectorService;
