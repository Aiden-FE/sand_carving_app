// 手机号码校验
export const phoneNumReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;

// 密码正则 6-16位中英文组成的密码
export const passWordReg = /^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]{6,16}$/;

// 用户名校验
export const userNameReg = /^[a-zA-Z0-9][a-zA-Z0-9_]{5,12}$/;

// 真实姓名校验 ： 2-26位字符，以汉字开头，支持数字结尾，中间不能包含数字
export const realNameReg = /^(([\u4E00-\u9FA5]+)(·[\u4E00-\u9FA5]+)*([0-9]*$))$/;

// 邮箱
export const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
