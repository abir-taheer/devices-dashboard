export default function getLevenshteinDistance(str1: string, str2: string) {
  const str1Length = str1.length;
  const str2Length = str2.length;

  if (str1Length === 0) {
    return str2Length;
  }

  if (str2Length === 0) {
    return str1Length;
  }

  const matrix = new Array(str1Length + 1);

  for (let i = 0; i <= str1Length; i++) {
    matrix[i] = new Array(str2Length + 1);
    matrix[i][0] = i;
  }

  for (let j = 0; j <= str2Length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1Length; i++) {
    for (let j = 1; j <= str2Length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str1Length][str2Length];
}
