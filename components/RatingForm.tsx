import React from 'react';

interface RatingFormProps {
  productName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

// FIX: Added an explicit props interface for Star to resolve issues with the 'key' prop being incorrectly inferred as a regular prop.
interface StarProps {
  filled: boolean;
  onClick: () => void;
}

const Star = ({ filled, onClick }: StarProps) => (
  <svg
    onClick={onClick}
    className={`w-8 h-8 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingForm = ({ productName, onSubmit, onClose }: RatingFormProps) => {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-pop-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
                <p className="text-gray-600 truncate mt-1">{productName}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <div className="mt-6">
            <p className="text-center font-semibold text-gray-700 mb-2">Bạn đánh giá sản phẩm này bao nhiêu sao?</p>
            <div className="flex justify-center items-center space-x-2" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                    <div
                        key={starIndex}
                        onMouseEnter={() => setHoverRating(starIndex)}
                    >
                        <Star
                            filled={(hoverRating || rating) >= starIndex}
                            onClick={() => setRating(starIndex)}
                        />
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-6">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Viết bình luận (tùy chọn)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors btn-primary"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;
