import exportToExcel from '../utils/exportToExcel';
import * as XLSX from 'xlsx';
import { dataProvider } from '../data';

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({})),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

jest.mock('../data', () => ({
  dataProvider: {
    exports: {
      startExport: jest.fn(),
    },
  },
}));

describe('exportToExcel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('builds workbook with requests and items sheets from exported rows', async () => {
    dataProvider.exports.startExport.mockResolvedValue({
      fileName: 'solicitudes_demo.xlsx',
      rows: [
        {
          solicitud_id: 101,
          created_at: '2026-03-01T12:00:00.000Z',
          status: 'submitted',
          canal_name: 'Tiendas',
          region_name: 'Bogota',
          subterritorio_name: 'Bogota Zona 1',
          pdv_id: 'pdv-001',
          pdv_name: 'PDV Demo',
          campania_name: 'Campania Verano 2026',
          prioridad: 1,
          created_by_name: 'Demo Tigo',
          observaciones: 'Observacion general',
          material_id: 'material-001',
          material_name: 'Sticker POP 1',
          cantidad: 10,
          medida_etiqueta: '10x10cm',
          medida_custom: null,
          item_observaciones: 'Obs item',
        },
      ],
    });

    const result = await exportToExcel({ canalId: 'tiendas' });

    expect(dataProvider.exports.startExport).toHaveBeenCalled();
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(2);
    expect(XLSX.writeFile).toHaveBeenCalledWith(undefined, 'solicitudes_demo.xlsx');
    expect(result).toEqual({
      ok: true,
      fileName: 'solicitudes_demo.xlsx',
      rows: 1,
      sheets: ['Solicitudes', 'Items'],
    });
  });
});
