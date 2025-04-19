export default {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
    // HTML dosyalarını taramak için gerekirse eklenebilir:
    // 'src/**/*.html',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './src/locales/',
  options: {
    debug: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    lngs: ['en', 'tr', 'ar'],
    defaultLng: 'en',
    defaultNs: 'translation',
    defaultValue: (lng, ns, key) => {
      if (lng === 'en') {
        // İngilizce için bulunan anahtarları doğrudan anahtar olarak kullan
        return key;
      }
      return ''; // Diğer diller için boş bırak
    },
    resource: {
      loadPath: '{{lng}}/{{ns}}.json',
      savePath: '{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    context: true, // bağlam özelliğini etkinleştir
    keySeparator: '.', // anahtarları ayırmak için nokta kullan 'translation.key'
    nsSeparator: ':', // namespace ayırıcısı, örn. 'ns:key'
    pluralSeparator: '_', // çoğul ayırıcısı, örn. 'key_plural'
    contextSeparator: '_', // bağlam ayırıcısı, örn. 'key_context'
    sort: true, // anahtarları alfabetik olarak sırala
  },
};
