"use client"

import { Zap, ChevronRight, ShoppingBag, Brain, FileText, Receipt } from "lucide-react"

const moreFeatures = [
    { icon: ShoppingBag, label: "Shopping", color: "bg-pink-100 text-pink-600" },
    { icon: Brain, label: "AI Assistant", color: "bg-green-100 text-green-600" },
    { icon: FileText, label: "Send Invoice", color: "bg-blue-100 text-blue-600" },
    { icon: Receipt, label: "Pay Bills", color: "bg-purple-100 text-purple-600" },
]

export function DoMoreSection() {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-base font-semibold text-gray-900">Do more with Goopenly</h3>
                <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {moreFeatures.map((feature, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 w-24 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">{feature.label}</span>
                        </div>
                    </div>
                ))}
                <div className="flex-shrink-0 flex items-center justify-center w-8">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>
    )
}
