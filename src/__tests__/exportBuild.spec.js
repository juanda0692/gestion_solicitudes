import exportToExcel from '../utils/exportToExcel';
import * as XLSX from 'xlsx';

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({})),
    sheet_add_aoa: jest.fn(),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

describe('exportToExcel', () => {
  test('ordered headers and snapshot data', () => {
    const exportObj = {
      scope: 'Canal',
      channelName: 'Canal X',
      pdvs: [
        {
          id: 'pdv-1',
          name: 'PDV Demo',
          regionName: 'Region',
          subterritoryName: 'Sub',
          date: '2024-01-01',
          requestType: 'SOLICITUD',
          materials: [{ name: 'VOLANTES', quantity: 20, measure: 'A4' }],
          pdvData: { contactName: 'Ana' },
        },
      ],
    };
    exportToExcel(exportObj);

    const expectedHeaders = [
      'Fecha',
      'Tipo',
      'Canal',
      'Región',
      'Subterritorio',
      'PDV',
      'Material',
      'Medida',
      'Cantidad',
      'Zonas',
      'Prioridad',
      'Campaña',
      'Contacto (PDV)',
      'Teléfono (PDV)',
      'Ciudad (PDV)',
      'Dirección (PDV)',
      'Notas internas (PDV)',
    ];

    const call = XLSX.utils.json_to_sheet.mock.calls[0];
    const rows = call[0];
    const options = call[1];
    expect(options.header).toEqual(expectedHeaders);
    expect(rows[0]['Contacto (PDV)']).toBe('Ana');
  });
});
