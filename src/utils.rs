pub const fn f32_to_ynear(value: f32) -> u128 {
    (value as u128) * 10u128.pow(24)
}
