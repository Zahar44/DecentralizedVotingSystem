export function fromUnit(value: number | bigint, decimals: number) {
    const denominator = BigInt('1' + '0'.repeat(decimals));
    return Number(BigInt(value) / denominator);
}