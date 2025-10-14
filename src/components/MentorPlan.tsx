"use client";
import React from 'react';
import { Phone, MessageCircle, Clock, Hand } from 'lucide-react';

interface MentorPlan {
  calls: string;
  qa: string;
  response: string;
  support: string;
}

interface MentorPlanProps {
  price: number;
  currency: string;
  plan: MentorPlan;
  availability?: string;
  onApply?: () => void;
}

const MentorPlan: React.FC<MentorPlanProps> = ({ 
  price, 
  currency, 
  plan, 
  availability,
  onApply 
}) => {
  const handleApplyNow = () => {
    if (onApply) {
      onApply();
    } else {
      alert('Apply now functionality coming soon!');
    }
  };

  const planFeatures = [
    {
      icon: Phone,
      text: plan.calls
    },
    {
      icon: MessageCircle,
      text: plan.qa
    },
    {
      icon: Clock,
      text: plan.response
    },
    {
      icon: Hand,
      text: plan.support
    }
  ];

  return (
    <div className="bg-[#F6F3EB] rounded-2xl border border-[#E8E3D8] p-6 sticky top-4">
      {/* Tabs */}
      <div className="flex border-b border-[#0C2727]/10 mb-6">
        <button className="flex-1 py-2 text-sm font-medium text-[#0C2727] border-b-2 border-[#008C83]">
          Mentorship plans
        </button>
        <button className="flex-1 py-2 text-sm font-medium text-[#0C2727]/60 hover:text-[#0C2727] transition-colors">
          Sessions
        </button>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-[#0C2727] mb-1">
          ${price} / month
        </div>
        <div className="text-sm text-[#0C2727]/60">
          {currency} per month
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-6">
        {planFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <Icon className="w-5 h-5 text-[#008C83]" />
              </div>
              <span className="text-sm text-[#0C2727]/80 leading-relaxed">
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyNow}
        className="w-full py-3 bg-gradient-to-r from-[#008C83] to-[#00A896] text-white rounded-lg hover:from-[#007A73] hover:to-[#009688] transition-all font-medium text-sm mb-4"
      >
        Apply now
      </button>

      {/* Trial Info */}
      <div className="text-center">
        <p className="text-xs text-[#0C2727]/60 mb-2">
          7-day free trial, cancel anytime. What's included?
        </p>
      </div>

      {/* Availability */}
      {availability && (
        <div className="mt-4 p-3 bg-[#008C83]/10 rounded-lg border border-[#008C83]/20">
          <div className="flex items-center gap-2 text-sm text-[#008C83] font-medium">
            <div className="w-2 h-2 bg-[#008C83] rounded-full"></div>
            {availability}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorPlan;
