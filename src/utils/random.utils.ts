// utils/random.utils.ts
export class RandomUtils {
  /**
   * Проверяет, выпало ли случайное число в заданном диапазоне
   * @param chance - вероятность в процентах (0-100)
   * @returns true с вероятностью chance%
   */
  static rollChance(chance: number): boolean {
    if (chance <= 0) return false;
    if (chance >= 100) return true;
    return Math.random() * 100 < chance;
  }
  
  /**
   * Альтернатива: проверка на конкретное число
   */
  static rollDice(sides: number, target: number): boolean {
    return Math.floor(Math.random() * sides) + 1 === target;
  }
}