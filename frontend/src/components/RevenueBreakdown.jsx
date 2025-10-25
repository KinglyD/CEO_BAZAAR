import { CurrencyDollarIcon } from '@heroicons/react/24/outline'

const RevenueBreakdown = ({ 
  totalRevenue, 
  platformFee = 6, 
  revenueSplit = [],
  showDetailed = true 
}) => {
  const platformAmount = totalRevenue * (platformFee / 100)
  const organizerShare = totalRevenue - platformAmount

  const calculateOrgShare = (percentage) => {
    return (organizerShare * percentage) / 100
  }

  return (
    <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/30 rounded-lg p-6">
      <h3 className="font-clash font-bold text-xl mb-4 flex items-center gap-2">
        <CurrencyDollarIcon className="h-6 w-6 text-gold" />
        Revenue Breakdown
      </h3>

      <div className="space-y-3">
        {/* Total Revenue */}
        <div className="flex justify-between items-center">
          <span className="text-graytext">Total Revenue</span>
          <span className="font-bold text-2xl">UGX {totalRevenue.toLocaleString()}</span>
        </div>

        {/* Platform Fee */}
        <div className="flex justify-between items-center text-red-400">
          <span>CEO Bazaar Platform Fee ({platformFee}%)</span>
          <span className="font-bold">- UGX {platformAmount.toLocaleString()}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-3">
          {/* Organizer Share */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Organizer Share ({100 - platformFee}%)</span>
            <span className="font-bold text-gold text-xl">UGX {organizerShare.toLocaleString()}</span>
          </div>

          {/* Individual Splits */}
          {showDetailed && revenueSplit.length > 0 && (
            <div className="space-y-2 pl-4 border-l-2 border-gold/50">
              {revenueSplit.map((split, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-graytext text-sm">{split.name}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden max-w-[100px]">
                        <div 
                          className="bg-gold h-full transition-all"
                          style={{ width: `${split.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gold font-semibold">{split.percentage}%</span>
                    </div>
                  </div>
                  <span className="font-semibold text-sm ml-4">
                    UGX {calculateOrgShare(split.percentage).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Note */}
        <div className="bg-gold/10 border border-gold/30 rounded-md p-3 mt-4">
          <p className="text-xs text-graytext">
            💡 Payouts are processed within 7 days after the event ends. 
            {revenueSplit.length > 1 && ' Each organization receives their share automatically.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RevenueBreakdown
