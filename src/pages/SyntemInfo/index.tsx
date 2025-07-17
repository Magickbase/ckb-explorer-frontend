import Status from './Status'
import Recommendations from './Recommendations'

const SystemInfoPage = () => {
  return (
    <div className="container px-4 py-10 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold mb-0!">CKB Explorer 运行配置</h1>
        <p className="text-sm mb-0!">实时监控与资源推荐</p>
      </div>
      <Status />
      <Recommendations />
    </div>
  )
}

export default SystemInfoPage
