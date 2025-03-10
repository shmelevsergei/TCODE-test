import PostList from "./components/post-list/PostList"
import Profile from "./components/profile/Profile"

const HomePage = () => {
  return (
    <main>
      <div className="container mx-auto px-6 h-full">
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <Profile />
          <PostList />
        </div>
      </div>
    </main>
  )
}

export default HomePage
