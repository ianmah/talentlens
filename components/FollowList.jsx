import style from 'styled-components'

const StyledFooter = style.div`
`

const FollowList = ({ type }) => {
  if (type === 'followers-talent') {
    return <p>hi ers t</p>
  }
  if (type === 'following-talent') {
    return <p>hi ing t</p>
  }
  if (type === 'followers-lens') {
    return <p>hi ers L</p>
  }
  if (type === 'following-lens') {
    return <p>hi ing L</p>
  }
  return <></>
}

export default FollowList