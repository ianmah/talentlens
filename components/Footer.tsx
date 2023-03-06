import style from 'styled-components'

const StyledFooter = style.footer`
    display: flex;
    flex: 1;
    padding: 2em 0;
    border-top: 1px solid ${p => p.theme.color.primary04};
    justify-content: center;
    align-items: center;
    a {
      color: ${p => p.theme.color.primary04};
    }
     position: absolute;
     bottom: 0;
     width: 330px;
     height: 1.4em;
     left: 0;
     right: 0;
     margin-left: auto;
     margin-right: auto;
`

const Footer = () => {
    return ( 
      <StyledFooter>
        <a href="https://twitter.com/irislabsxyz" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at Iris Labs
        </a>
      </StyledFooter>
    )
}

export default Footer