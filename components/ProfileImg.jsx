import style from 'styled-components'

export default style.div`
  display: block;
  height: ${p => p.size || '100px'};
  width: ${p => p.size || '100px'};
  background: url(${p => p.src || 'https://beta.talentprotocol.com/packs/media/images/648f6f70811618825dc9.png'}) center;
  background-size: cover;
  border-radius: 100%;
`