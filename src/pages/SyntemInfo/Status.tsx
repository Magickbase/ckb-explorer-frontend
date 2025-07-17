import { ReactComponent as DatabaseIcon } from './database.svg'
import { ReactComponent as ServerIcon } from './server.svg'

const Status = () => {
  const metrics = [
    {
      label: 'Database Size',
      icon: <DatabaseIcon className="h-6 w-6 text-blue-600" />,
      metrics: [
        { label: 'Database Size', value: '300', unit: 'GB' },
        { label: 'Index Size', value: '150', unit: 'GB' },
        { label: 'Daily Growth', value: '500MB', unit: '- 1GB' },
      ],
    },
    {
      label: 'Service Resources',
      icon: <ServerIcon className="h-6 w-6 text-green-600" />,
      metrics: [
        { label: 'CPU Usage', value: '40', unit: '%' },
        { label: 'Memory Usage', value: '10GB / 32GB', unit: '(31%)' },
        { label: 'Network Bandwidth', value: '15Mbps', unit: '(In) /8Mbps (Out)' },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {metrics.map(metric => (
        <div key={metric.label} className="flex flex-col gap-3 bg-white rounded-sm shadow-sm px-6 py-6">
          <div className="flex items-center">
            <div className="mr-3">{metric.icon}</div>
            <h2 className="text-xl mb-0!">{metric.label}</h2>
          </div>
          <div className="space-y-3">
            {metric.metrics.map(metric => (
              <div key={metric.label} className="flex items-center">
                <span>{metric.label}&nbsp;:&nbsp;</span>
                <span>
                  {metric.value}
                  {metric.unit && <span>{metric.unit}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Status
