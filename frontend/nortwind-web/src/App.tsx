import './App.css'
import Header from './Components/Header'
import SideBar from './Components/SideBar'
import Content from './Components/Content'

function App() {
  return (
    <>
      <div className="page-wrapper" id="main-wrapper"  data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full"
        data-sidebar-position="fixed" data-header-position="fixed">
        
        {/* Left Sidebar */}
        <SideBar />

        {/* Content Area */}
        <div className="body-wrapper">
          <Header />
          <div className="container-fluid mt-4">
            <Content />
          </div>
        </div>

      </div>
    </>
  )
}

export default App
