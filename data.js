const GROUPS = [
  {
    id: 'A', name: 'ჯგ. A',
    teams: [
      { id: 'MEX', name: 'მექსიკა', flag: '🇲🇽' },
      { id: 'RSA', name: 'სამხ. აფრიკა', flag: '🇿🇦' },
      { id: 'KOR', name: 'სამხ. კორეა', flag: '🇰🇷' },
      { id: 'CZE', name: 'ჩეხეთი', flag: '🇨🇿' },
    ]
  },
  {
    id: 'B', name: 'ჯგ. B',
    teams: [
      { id: 'CAN', name: 'კანადა', flag: '🇨🇦' },
      { id: 'BIH', name: 'ბოსნია', flag: '🇧🇦' },
      { id: 'QAT', name: 'კატარი', flag: '🇶🇦' },
      { id: 'SUI', name: 'შვეიცარია', flag: '🇨🇭' },
    ]
  },
  {
    id: 'C', name: 'ჯგ. C',
    teams: [
      { id: 'BRA', name: 'ბრაზილია', flag: '🇧🇷' },
      { id: 'MAR', name: 'მაროკო', flag: '🇲🇦' },
      { id: 'HAI', name: 'ჰაიტი', flag: '🇭🇹' },
      { id: 'SCO', name: 'შოტლანდია', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    ]
  },
  {
    id: 'D', name: 'ჯგ. D',
    teams: [
      { id: 'USA', name: 'აშშ', flag: '🇺🇸' },
      { id: 'PAR', name: 'პარაგვაი', flag: '🇵🇾' },
      { id: 'AUS', name: 'ავსტრალია', flag: '🇦🇺' },
      { id: 'TUR', name: 'თურქეთი', flag: '🇹🇷' },
    ]
  },
  {
    id: 'E', name: 'ჯგ. E',
    teams: [
      { id: 'GER', name: 'გერმანია', flag: '🇩🇪' },
      { id: 'CUW', name: 'კიურასაო', flag: '🇨🇼' },
      { id: 'CIV', name: 'კოტ-დ\'ივუარი', flag: '🇨🇮' },
      { id: 'ECU', name: 'ეკვადორი', flag: '🇪🇨' },
    ]
  },
  {
    id: 'F', name: 'ჯგ. F',
    teams: [
      { id: 'NED', name: 'ნიდერლანდი', flag: '🇳🇱' },
      { id: 'JPN', name: 'იაპონია', flag: '🇯🇵' },
      { id: 'SWE', name: 'შვედეთი', flag: '🇸🇪' },
      { id: 'TUN', name: 'ტუნისი', flag: '🇹🇳' },
    ]
  },
  {
    id: 'G', name: 'ჯგ. G',
    teams: [
      { id: 'BEL', name: 'ბელგია', flag: '🇧🇪' },
      { id: 'EGY', name: 'ეგვიპტე', flag: '🇪🇬' },
      { id: 'IRN', name: 'ირანი', flag: '🇮🇷' },
      { id: 'NZL', name: 'ახ. ზელანდია', flag: '🇳🇿' },
    ]
  },
  {
    id: 'H', name: 'ჯგ. H',
    teams: [
      { id: 'ESP', name: 'ესპანეთი', flag: '🇪🇸' },
      { id: 'CPV', name: 'კაბო-ვერდე', flag: '🇨🇻' },
      { id: 'KSA', name: 'საუდ. არაბეთი', flag: '🇸🇦' },
      { id: 'URU', name: 'ურუგვაი', flag: '🇺🇾' },
    ]
  },
  {
    id: 'I', name: 'ჯგ. I',
    teams: [
      { id: 'FRA', name: 'საფრანგეთი', flag: '🇫🇷' },
      { id: 'SEN', name: 'სენეგალი', flag: '🇸🇳' },
      { id: 'IRQ', name: 'ირაყი', flag: '🇮🇶' },
      { id: 'NOR', name: 'ნორვეგია', flag: '🇳🇴' },
    ]
  },
  {
    id: 'J', name: 'ჯგ. J',
    teams: [
      { id: 'ARG', name: 'არგენტინა', flag: '🇦🇷' },
      { id: 'ALG', name: 'ალჟირი', flag: '🇩🇿' },
      { id: 'AUT', name: 'ავსტრია', flag: '🇦🇹' },
      { id: 'JOR', name: 'იორდანია', flag: '🇯🇴' },
    ]
  },
  {
    id: 'K', name: 'ჯგ. K',
    teams: [
      { id: 'POR', name: 'პორტუგალია', flag: '🇵🇹' },
      { id: 'COD', name: 'კონგო (დემ.)', flag: '🇨🇩' },
      { id: 'UZB', name: 'უზბეკეთი', flag: '🇺🇿' },
      { id: 'COL', name: 'კოლუმბია', flag: '🇨🇴' },
    ]
  },
  {
    id: 'L', name: 'ჯგ. L',
    teams: [
      { id: 'ENG', name: 'ინგლისი', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { id: 'CRO', name: 'ხორვატია', flag: '🇭🇷' },
      { id: 'GHA', name: 'განა', flag: '🇬🇭' },
      { id: 'PAN', name: 'პანამა', flag: '🇵🇦' },
    ]
  },
];

// Official FIFA 2026 Round of 32 bracket seeding
// 16 matches ordered so buildRound() produces correct R16→QF→SF→Final tree
// Source: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures
//
// Official bracket tree (FIFA fixture match numbers in parentheses):
//   Final M104 = SF M101 vs SF M102
//   M101 = QF M97 vs QF M98       (left half)
//   M102 = QF M99 vs QF M100      (right half)
//   M97 = R16 M89 vs M90 ; M98 = R16 M93 vs M94
//   M99 = R16 M91 vs M92 ; M100 = R16 M95 vs M96
//   M89=M74,M77  M90=M73,M75  M93=M83,M84  M94=M81,M82
//   M91=M76,M78  M92=M79,M80  M95=M86,M88  M96=M85,M87
//
// buildRound() pairs the array in consecutive 2s, so leaves must be listed
// in that exact bottom-of-tree order. Match slots: pos = '1','2', or '3';
// '3' slots use a group-set code to assign the user's 3rd-place picks.
const R32 = [
  // ── LEFT HALF → semifinal M101 ──
  // M97 branch
  { pos1: '1', g1: 'E', pos2: '3', grpSet: 'ABCDF' },   // M74: 1E vs 3ABCDF  (→M89)
  { pos1: '1', g1: 'I', pos2: '3', grpSet: 'CDFGH' },   // M77: 1I vs 3CDFGH  (→M89)
  { pos1: '2', g1: 'A', pos2: '2', g2: 'B' },           // M73: 2A vs 2B      (→M90)
  { pos1: '1', g1: 'F', pos2: '2', g2: 'C' },           // M75: 1F vs 2C      (→M90)
  // M98 branch
  { pos1: '2', g1: 'K', pos2: '2', g2: 'L' },           // M83: 2K vs 2L      (→M93)
  { pos1: '1', g1: 'H', pos2: '2', g2: 'J' },           // M84: 1H vs 2J      (→M93)
  { pos1: '1', g1: 'D', pos2: '3', grpSet: 'BEFIJ' },   // M81: 1D vs 3BEFIJ  (→M94)
  { pos1: '1', g1: 'G', pos2: '3', grpSet: 'AEHIJ' },   // M82: 1G vs 3AEHIJ  (→M94)
  // ── RIGHT HALF → semifinal M102 ──
  // M99 branch
  { pos1: '1', g1: 'C', pos2: '2', g2: 'F' },           // M76: 1C vs 2F      (→M91)
  { pos1: '2', g1: 'E', pos2: '2', g2: 'I' },           // M78: 2E vs 2I      (→M91)
  { pos1: '1', g1: 'A', pos2: '3', grpSet: 'CEFHI' },   // M79: 1A vs 3CEFHI  (→M92)
  { pos1: '1', g1: 'L', pos2: '3', grpSet: 'EHIJK' },   // M80: 1L vs 3EHIJK  (→M92)
  // M100 branch
  { pos1: '1', g1: 'J', pos2: '2', g2: 'H' },           // M86: 1J vs 2H      (→M95)
  { pos1: '2', g1: 'D', pos2: '2', g2: 'G' },           // M88: 2D vs 2G      (→M95)
  { pos1: '1', g1: 'B', pos2: '3', grpSet: 'EFGIJ' },   // M85: 1B vs 3EFGIJ  (→M96)
  { pos1: '1', g1: 'K', pos2: '3', grpSet: 'DEIJL' },   // M87: 1K vs 3DEIJL  (→M96)
];
