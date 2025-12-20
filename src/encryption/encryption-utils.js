

/*
 * byte = 8 bit, binary is 8x 0|1 units, and I guess the byte would be the 2 digit version of the character ?
 */
// export const stringToBits = () => {
//   // c.charCodeAt(0).toString(2).padStart(8, '0'))
// }

export const charToBits = (charByte) => charByte.padStart(8, '0')

export const charToByte = (char) => char.charCodeAt(0).toString(2)



