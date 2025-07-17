import { ReactComponent as RecommendationsIcon } from './recommendations.svg'
import { ReactComponent as CpuIcon } from './cpu.svg'
import { ReactComponent as MemoryIcon } from './memory.svg'
import { ReactComponent as StorageIcon } from './storage.svg'
import { ReactComponent as NetworkIcon } from './network.svg'

const Recommendations = () => {
  const data = [
    {
      title: 'CPU Configuration',
      icon: <CpuIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: 'Minimum', value: '4 cores (2.4GHz+)' },
        { label: 'Recommended', value: '8 cores (3.0GHz+)' },
        { label: 'High Performance', value: '16 cores (3.5GHz+)' },
      ],
      note: 'Initial sync requires more CPU for full node operations',
    },
    {
      title: 'Memory Configuration',
      icon: <MemoryIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: 'Minimum', value: '4GB' },
        { label: 'Recommended', value: '8GB' },
        { label: 'High Performance', value: '16GB' },
      ],
      note: 'Memory requirements increase with transaction volume',
    },
    {
      title: 'Storage Configuration',
      icon: <StorageIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: 'Current Block Size', value: '~500GB' },
        { label: 'Annual Growth', value: '~50-100GB' },
        { label: 'Recommended', value: '1TB+ SSD' },
      ],
      note: 'Using SSD significantly improves sync speed and performance',
    },
    {
      title: 'Network Configuration',
      icon: <NetworkIcon className="h-5 w-5 text-gray-600 mr-2" />,
      items: [
        { label: 'Initial Sync', value: '10Mbps+ (Recommend 50Mbps+)' },
        { label: 'Daily Operation', value: '5Mbps+' },
        { label: 'High Load API', value: '100Mbps+' },
      ],
      note: 'Higher bandwidth required for initial sync operations',
    },
  ]
  const colors = ['#F2A208', '#00CC9B', '#1CA2FB']

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6 gap-1">
        <RecommendationsIcon className="h-6 w-6" />
        <h2 className="text-xl font-semibold text-gray-900 mb-0!">Recommended Server Configuration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map(i => (
          <div key={i.title} className="bg-[#F5F5F5] rounded-lg px-4 py-3">
            <div className="flex items-center mb-3">
              {i.icon}
              <h3 className="font-medium text-gray-900 mb-0!">{i.title}</h3>
            </div>
            <div className="space-y-2">
              {i.items.map((config, index) => (
                <div key={config.label} className="flex flex-wrap items-center gap-1 rounded-md">
                  <span className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span>{config.label}:</span>
                  <span>{config.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2! mb-0!">*{i.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommendations
