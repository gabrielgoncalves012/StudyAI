import Header from './Header'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </>
  )
}

export default Layout
