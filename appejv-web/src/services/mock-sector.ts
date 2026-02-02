import { Sector, Combo, Content } from '@/types';

const MOCK_SECTORS: Sector[] = [
  {
    id: 1,
    name: 'Appe',
    description: 'Thức ăn heo CP59 chất lượng cao cho các giai đoạn phát triển',
    image: '',
    list_combos: [
      { id: 1, name: 'Thức ăn heo con CP59 (3-5kg)', price: 18500, description: 'Dành cho heo con giai đoạn 3-5kg', image: '', sector_id: 1, product_ids: [1, 2, 3], created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Thức ăn heo thịt CP59 (20-40kg)', price: 16800, description: 'Dành cho heo thịt giai đoạn 20-40kg', image: '', sector_id: 1, product_ids: [1, 2, 3, 4], created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    ],
    list_contents: [
      { id: 1, title: 'Lợi ích của thức ăn heo CP59 chất lượng', content: 'Thức ăn heo CP59 giúp heo phát triển khỏe mạnh với tỷ lệ chuyển đổi thức ăn tối ưu...', image: '', brand: 'Appe JV', category: 'education', sector_id: 1, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    ],
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'RTD',
    description: 'Thức ăn chăn nuôi cao cấp và bổ sung dinh dưỡng',
    image: '',
    list_combos: [
      { id: 3, name: 'Thức ăn heo nái mang thai CP59', price: 17200, description: 'Dành cho heo nái giai đoạn mang thai', image: '', sector_id: 2, product_ids: [5, 6], created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
    ],
    list_contents: [],
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
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
