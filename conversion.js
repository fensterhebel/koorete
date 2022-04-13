// converts latin Koorete text to Fidel

const FIDEL = 'ኣጰቸዸ    ኢዠ     ጰ  ሸጠ   ጸ        አበጨደኤፈገሀእጀከለመነኦፐቀረሰተኡቨወሠየዘ'

function toGeezNumber (num) {
  num = num.toString().replace(/\D/g, '').replace(/^0+/, '')
  num = num.split('').reverse().map(n => +n)
  if (num.length % 2 !== 0) num.push(0)
  let res = ''
  for (let i = 0; i < num.length; i += 2) {
    let part = ''
    for (let d = 1; d >= 0; d--) {
      if (num[i + d]) {
        part += String.fromCharCode(0x1368 + 0x9 * d + num[i + d])
      }
    }
    if (i > 0) {
      if ((i / 2) % 2 === 0) {
        res = '\u137c' + res
        if (part === '\u1369' && i + 2 === num.length) continue
      } else if (part) {
        res = '\u137b' + res
        if (part === '\u1369') continue
      }
    }
    res = part + res
  }
  return res
}

function toFidel (str, replaceNumbers = false, preserveDoubling = false) {
  // there are no capitals in Fidel
  str = str.toLowerCase()
  str = str.replace(/([A-Za-z])['’]([aeiou])/g, '$1ʾ$2')
  if (preserveDoubling) {
    str = str.replace(/([bcdfgj-nq-tw-z])\1(h?)([aeiou]+)/g, '$1$2$3\u135f')
  } else {
    str = str.replace(/([bcdfgj-nq-tw-z])\1(h?)/g, '$1$2')
  }

  str = str.replace(/\./g, '።').replace(/,/g, '፥')
  str = str.replace(/aa/g, 'A').replace(/ii/g, 'I').replace(/([eou])\1/g, '$1')
  str = str.replace(/([bcdjpstx])h/g, (m, l) => l.toUpperCase())
  str = str.replace(/([bcdfghj-np-tv-zBCDJPSTX])([aAeiIou]?)/g, (m, c, v) => String.fromCharCode(FIDEL[c.charCodeAt() - 65].charCodeAt() + ('ioauIAe'.indexOf(v) + 5) % 7))
  str = str.replace(/['’ʾ]?([aAeiIou])/g, (m, v) => String.fromCharCode(FIDEL[v.charCodeAt() - 65].charCodeAt()))
  if (replaceNumbers) {
    str = str.replace(/\d+/g, num => toGeezNumber(num))
  }
  return str
}
