const App=()=>{
  return(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl m-auto flex justify-between mt-2.5">
        <h1 className="text-4xl font-bold text-blue-600">Linklytics</h1>
        <nav className="ml-0.5">
          <a className="ml-0.5" href="/">HOME</a>
          <a className="ml-0.5" href="/dashboard">DASHBOARD</a>
        </nav>
      </div>
      <div>
        <h1>horten Your Links. Track Every Click.</h1>
        <p>Linklystic is about gettunf short link</p>
        <input type="text"></input>
        <button type="submit">Shorten URL</button>
        <p>Your shortern url will display hear</p>
      </div>
    </div>
  )
}

export default App;