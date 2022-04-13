// converts latin Koorete text to Fidel

// Fidel characters in order of the alphabet (upper- and lowercase letters) in ASCII
const FIDEL = 'ኣጰቸዸ    ኢዠ     ጰ  ሸጠ   ጸ        አበጨደኤፈገሀእጀከለመነኦፐቀረሰተኡቨወሠየዘ'

// Geez number representation
function toGeezNumber (num) {
  // delete non-numerical characters and leading zeros
  num = num.toString().replace(/\D/g, '').replace(/^0+/, '')

  num = num.split('').reverse().map(n => +n)
  if (num.length % 2 !== 0) num.push(0)
  let res = ''
  for (let i = 0; i < num.length; i += 2) {
    let part = ''
    for (let d = 1; d >= 0; d--) {
      // tens and units
      if (num[i + d]) {
        part += String.fromCharCode(0x1368 + 0x9 * d + num[i + d])
      }
    }
    if (i > 0) {
      // insert 100s and 10000s characters
      if ((i / 2) % 2 === 0) {
        res = '\u137c' + res
        // omit ones
        if (part === '\u1369' && i + 2 === num.length) continue
      } else if (part) {
        res = '\u137b' + res
        // omit ones
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
  // replace apostrophe between letters (glottal stop) with proper unicode character
  str = str.replace(/([a-z])['’]([aeiou])/g, '$1ʾ$2')
  if (preserveDoubling) {
    // inserts two dots for double consonant marking
    str = str.replace(/([bcdfgj-nq-tw-z])\1(h?)([aeiou]+)/g, '$1$2$3\u135f')
  } else {
    str = str.replace(/([bcdfgj-nq-tw-z])\1(h?)/g, '$1$2')
  }

  // replace punctuation
  str = str.replace(/\./g, '።').replace(/,/g, '፥')
  // replace double vowels ('a' and 'i') with capitals, discard the rest (underrepresentation in Fidel)
  str = str.replace(/aa/g, 'A').replace(/ii/g, 'I').replace(/([eou])\1/g, '$1')
  // replace digraphs with capitals
  str = str.replace(/([bcdjpstx])h/g, (m, l) => l.toUpperCase())
  // convert CV pairs
  str = str.replace(/([bcdfghj-np-tv-zBCDJPSTX])([aAeiIou]?)/g, (m, c, v) => String.fromCharCode(FIDEL[c.charCodeAt() - 65].charCodeAt() + ('ioauIAe'.indexOf(v) + 5) % 7))
  // convert remaining Vs (and glottal stop + V)
  str = str.replace(/ʾ?([aAeiIou])/g, (m, v) => String.fromCharCode(FIDEL[v.charCodeAt() - 65].charCodeAt()))
  if (replaceNumbers) {
    str = str.replace(/\d+/g, num => toGeezNumber(num))
  }
  return str
}
