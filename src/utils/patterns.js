// 手机号码校验
export const phoneNumReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;

// 密码正则 6-16位中英文组成的密码
export const passWordReg = /^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]{6,16}$/;

// 用户名校验
export const userNameReg = /^[a-zA-Z0-9][a-zA-Z0-9_]{5,12}$/;

// 邮箱
export const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
