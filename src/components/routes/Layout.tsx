import { Button, Navbar } from "@blueprintjs/core"
import { Outlet } from "react-router"
import { NavLink } from "react-router-dom"


const Layout = () => {
  return (
    <>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading className="bp4-large">Heading</Navbar.Heading>
          <Navbar.Divider/>
          <NavLink to="/"> <Button large minimal>Home</Button></NavLink>
          <NavLink to="calc"><Button large minimal>Calcualtor</Button></NavLink>
          <NavLink to="autograd"><Button large minimal>Autograd</Button></NavLink>
          <NavLink to="cityinfo"><Button large minimal>City Info</Button></NavLink>
        </Navbar.Group>
        <Navbar.Group about="foo" align="right">
          <Button icon="help" intent="primary" large minimal/>
        </Navbar.Group>
      </Navbar>

      <Outlet/>
    </>
  )
}


export default Layout
