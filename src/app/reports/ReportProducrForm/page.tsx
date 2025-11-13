/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT_REPORT } from '../../../graphql/mutations';
import { ReportReason } from '../../../types/type';
import { toast } from 'react-hot-toast';

export default function ReportProductForm({ productId }: { productId: string }) {
  const [createReport] = useMutation(CREATE_PRODUCT_REPORT);
  const [reason, setReason] = useState<ReportReason>(ReportReason.FAKE_PRODUCT);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await createReport({
        variables: {
          input: {
            productId,
            reason,
            details: details || undefined,
          },
        },
      });

      if (data?.createProductReport) {
        toast.success('Report submitted successfully!');
        setDetails('');
        setReason(ReportReason.FAKE_PRODUCT);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Report this product</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for reporting
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {Object.values(ReportReason).map((value) => (
              <option key={value} value={value}>
                {value.toLowerCase().replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
            Additional details (optional)
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please provide more information about your report..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setDetails('');
              setReason(ReportReason.FAKE_PRODUCT);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}