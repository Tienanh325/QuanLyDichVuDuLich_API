import { useMemo, useState } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Star } from 'lucide-react';
import '../assets/css/ReviewSection.css';
import {
  createReview,
  getMyReview,
  getReviewCriteria,
  getReviews,
  type ReviewItem,
  type ReviewPayload,
  updateReview,
} from '../services/danhGiaService';

type Props = {
  maDichVu: number;
  serviceName: string;
  serviceType: 'hotel' | 'flight' | 'train' | 'tour';
};

const verifiedLabels = {
  hotel: 'Đã lưu trú tại đây',
  flight: 'Đã bay chuyến này',
  train: 'Đã đi chuyến này',
  tour: 'Đã tham gia tour này',
};

function ratingLabel(score10: number) {
  if (score10 >= 9) return 'Xuất sắc';
  if (score10 >= 8) return 'Tuyệt vời';
  if (score10 >= 7) return 'Tốt';
  if (score10 >= 6) return 'Dễ chịu';
  return 'Cần cải thiện';
}

function getReviewErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : 'Không gửi được đánh giá.';
}

function StarRating({ value, onChange, size = 22 }: { value: number; onChange?: (value: number) => void; size?: number }) {
  return (
    <div className="review-stars" aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" className="review-stars__btn" onClick={() => onChange?.(star)} disabled={!onChange}>
          <Star size={size} fill={star <= value ? '#fbbf24' : 'none'} color={star <= value ? '#fbbf24' : '#cbd5e1'} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, serviceType }: { review: ReviewItem; serviceType: Props['serviceType'] }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.binhLuan ?? '';
  const shouldClamp = text.length > 220;
  const name = review.tenUser || review.username || 'Khách hàng';
  return (
    <article className="review-card">
      <div className="review-card__avatar">{name.charAt(0).toUpperCase()}</div>
      <div className="review-card__body">
        <div className="review-card__top">
          <div>
            <h4>{name}</h4>
            <div className="review-card__meta">
              {review.daXacMinh ? <span><CheckCircle2 size={14} /> {verifiedLabels[serviceType]}</span> : null}
              <span>{new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
          <div className="review-card__score">{Number(review.soSao * 2).toFixed(1)}</div>
        </div>
        <div className="review-card__rating"><StarRating value={review.soSao} /></div>
        {review.tieuDe ? <h3 className="review-card__title">{review.tieuDe}</h3> : null}
        {text ? <p className={expanded ? '' : 'review-card__text'}>{text}</p> : null}
        {shouldClamp ? <button className="review-link" type="button" onClick={() => setExpanded((prev) => !prev)}>{expanded ? 'Thu gọn' : 'Xem thêm'}</button> : null}
        {review.hinhAnh?.length ? (
          <div className="review-card__photos">
            {review.hinhAnh.slice(0, 5).map((src) => <img key={src} src={src} alt="Ảnh đánh giá" />)}
          </div>
        ) : null}
        {review.tieuChi?.length ? (
          <div className="review-card__criteria">
            {review.tieuChi.map((item) => <span key={item.maTieuChi}>{item.tenTieuChi} {item.diem}</span>)}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ReviewSection({ maDichVu, serviceName, serviceType }: Props) {
  const queryClient = useQueryClient();
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest' | 'images'>('newest');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ soSao: 5, tieuDe: '', binhLuan: '' });
  const [criteriaScores, setCriteriaScores] = useState<Record<number, number>>({});

  const reviewsQuery = useQuery({
    queryKey: ['reviews', maDichVu, ratingFilter, sort],
    queryFn: () => getReviews({ maDichVu, page: 1, limit: 8, soSao: ratingFilter, sort }),
  });
  const criteriaQuery = useQuery({ queryKey: ['review-criteria', maDichVu], queryFn: () => getReviewCriteria(maDichVu) });
  const myReviewQuery = useQuery({ queryKey: ['my-review', maDichVu], queryFn: () => getMyReview(maDichVu), retry: false });

  const summary = reviewsQuery.data?.thongKeSao;
  const reviews = reviewsQuery.data?.data ?? [];
  const avg5 = Number(summary?.diemTrungBinh ?? 0);
  const avg10 = avg5 * 2;
  const total = Number(summary?.tongDanhGia ?? 0);
  const canEdit = Boolean(myReviewQuery.data);

  const payload = useMemo<ReviewPayload>(() => ({
    maDichVu,
    soSao: form.soSao,
    tieuDe: form.tieuDe.trim(),
    binhLuan: form.binhLuan.trim(),
    tieuChi: Object.entries(criteriaScores).map(([maTieuChi, diem]) => ({ maTieuChi: Number(maTieuChi), diem })),
  }), [criteriaScores, form, maDichVu]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (canEdit && myReviewQuery.data) await updateReview(myReviewQuery.data.maDanhGia, payload);
      else await createReview(payload);
    },
    onSuccess: () => {
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', maDichVu] });
      queryClient.invalidateQueries({ queryKey: ['my-review', maDichVu] });
    },
  });

  function openForm() {
    const mine = myReviewQuery.data;
    setForm({
      soSao: mine?.soSao ?? 5,
      tieuDe: mine?.tieuDe ?? '',
      binhLuan: mine?.binhLuan ?? '',
    });
    const nextScores: Record<number, number> = {};
    mine?.tieuChi?.forEach((item) => { if (item.diem) nextScores[item.maTieuChi] = item.diem; });
    setCriteriaScores(nextScores);
    setShowForm(true);
  }

  return (
    <section className="review-section" id="danh-gia">
      <div className="review-section__head">
        <div>
          <span>Đánh giá khách hàng</span>
          <h2>Khách hàng nói gì về {serviceName}</h2>
          <p>Review thật từ khách đã đặt và sử dụng dịch vụ.</p>
        </div>
        <button type="button" className="review-primary-btn" onClick={openForm}>{canEdit ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}</button>
      </div>

      {reviewsQuery.isLoading ? <div className="review-skeleton" /> : total === 0 ? (
        <div className="review-empty"><Star size={34} /><h3>Chưa có đánh giá nào</h3><p>Hãy là người đầu tiên chia sẻ trải nghiệm sau khi sử dụng dịch vụ.</p></div>
      ) : (
        <>
          <div className="review-summary">
            <div className="review-summary__score"><strong>{avg10.toFixed(1)}</strong><span>{ratingLabel(avg10)}</span><small>{total} đánh giá</small><StarRating value={Math.round(avg5)} /></div>
            <div className="review-summary__bars">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = Number(summary?.phanPhoi?.find((item) => Number(item.soSao) === star)?.soLuong ?? 0);
                const pct = total ? Math.round((count / total) * 100) : 0;
                return <button key={star} type="button" className="review-bar" onClick={() => setRatingFilter(ratingFilter === star ? undefined : star)}><span>{star} sao</span><div><i style={{ width: `${pct}%` }} /></div><b>{pct}%</b></button>;
              })}
            </div>
            <div className="review-summary__criteria">
              {(summary?.tieuChi ?? []).map((item) => <div key={item.maTieuChi}><span>{item.tenTieuChi}</span><strong>{(Number(item.diemTrungBinh ?? 0) * 2).toFixed(1)}</strong></div>)}
            </div>
          </div>

          <div className="review-toolbar">
            <div>
              <button className={!ratingFilter ? 'is-active' : ''} onClick={() => setRatingFilter(undefined)}>Tất cả</button>
              {[5, 4, 3, 2, 1].map((star) => <button key={star} className={ratingFilter === star ? 'is-active' : ''} onClick={() => setRatingFilter(star)}>{star} sao</button>)}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
              <option value="newest">Mới nhất</option>
              <option value="highest">Điểm cao nhất</option>
              <option value="lowest">Điểm thấp nhất</option>
              <option value="images">Có hình ảnh</option>
            </select>
          </div>

          <div className="review-list">{reviews.map((review) => <ReviewCard key={review.maDanhGia} review={review} serviceType={serviceType} />)}</div>
        </>
      )}

      {showForm ? (
        <div className="review-form-wrap">
          <div className="review-form">
            <div className="review-form__head"><h3>{canEdit ? 'Cập nhật đánh giá' : 'Viết đánh giá của bạn'}</h3><p>Chia sẻ trải nghiệm thực tế để giúp khách hàng khác chọn tốt hơn.</p></div>
            <label>Đánh giá tổng thể<StarRating value={form.soSao} onChange={(soSao) => setForm((prev) => ({ ...prev, soSao }))} size={28} /></label>
            <div className="review-form__criteria">
              {criteriaQuery.data?.map((item) => <label key={item.maTieuChi}>{item.tenTieuChi}<StarRating value={criteriaScores[item.maTieuChi] ?? 0} onChange={(diem) => setCriteriaScores((prev) => ({ ...prev, [item.maTieuChi]: diem }))} /></label>)}
            </div>
            <label>Tiêu đề đánh giá<input value={form.tieuDe} maxLength={150} placeholder="Ví dụ: Trải nghiệm rất đáng tiền" onChange={(e) => setForm((prev) => ({ ...prev, tieuDe: e.target.value }))} /></label>
            <label>Nội dung bình luận<textarea value={form.binhLuan} maxLength={2000} placeholder="Bạn thích điều gì nhất? Có điểm nào cần cải thiện?" onChange={(e) => setForm((prev) => ({ ...prev, binhLuan: e.target.value }))} /><small>{form.binhLuan.length}/2000 ký tự</small></label>
            {submitMutation.error ? <div className="review-error">{getReviewErrorMessage(submitMutation.error)}</div> : null}
            <div className="review-form__actions"><button type="button" onClick={() => setShowForm(false)}>Hủy</button><button type="button" className="review-primary-btn" disabled={submitMutation.isPending} onClick={() => submitMutation.mutate()}>{submitMutation.isPending ? <Loader2 size={16} /> : null} {canEdit ? 'Cập nhật' : 'Gửi đánh giá'}</button></div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
