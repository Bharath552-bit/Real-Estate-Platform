import React, { useState } from "react";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateEMI = () => {
    if (!loanAmount || !interestRate || !loanTenure) {
      return;
    }

    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const tenureMonths = parseInt(loanTenure) * 12;
    
    const monthlyRate = annualRate / 12 / 100;

    if (monthlyRate === 0) {
      const emiValue = principal / tenureMonths;
      setEmi(emiValue.toFixed(2));
      setTotalPayment((emiValue * tenureMonths).toFixed(2));
      setTotalInterest(((emiValue * tenureMonths) - principal).toFixed(2));
    } else {
      const emiValue =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

      setEmi(emiValue.toFixed(2));
      setTotalPayment((emiValue * tenureMonths).toFixed(2));
      setTotalInterest(((emiValue * tenureMonths) - principal).toFixed(2));
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 EMI Calculator</h2>

      {/* Loan Amount Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Loan Amount (₹)
        </label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter loan amount"
        />
      </div>

      {/* Interest Rate Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Interest Rate (%)
        </label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter interest rate"
        />
      </div>

      {/* Loan Tenure Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Loan Tenure (Years)
        </label>
        <input
          type="number"
          value={loanTenure}
          onChange={(e) => setLoanTenure(e.target.value)}
          className="w-full p-2 border border-gray-300 text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter loan tenure in years"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateEMI}
        className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
      >
        Calculate EMI
      </button>

      {/* Results */}
      {emi !== null && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-2">📊 EMI Breakdown</h3>
          <p className="text-lg font-semibold text-gray-700">
            Monthly EMI: ₹{emi}
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Total Payment: ₹{totalPayment}
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Total Interest: ₹{totalInterest}
          </p>
        </div>
      )}
    </div>
  );
}
