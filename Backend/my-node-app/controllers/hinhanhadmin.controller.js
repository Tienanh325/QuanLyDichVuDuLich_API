const HinhAnhModel = require('../models/hinhanh.model');
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');
const listResult = (data) => (data && data.data ? data : { data, totalRecords: data.length, totalPages: 1, currentPage: 1 });

class HinhAnhAdminController {
    static async getAllImages(req, res) {
        try {
            const data = await HinhAnhModel.getAll(req.query);
            return res.status(200).json({ status: 'success', data: listResult(data), message: 'Danh sách hình ảnh' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async getImageById(req, res) {
        try {
            const image = await HinhAnhModel.getById(Number(req.params.id));
            if (!image) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy ảnh' });
            return res.status(200).json({ status: 'success', data: image, message: 'Chi tiết ảnh' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async createFromUrl(req, res) {
        try {
            const { urlAnh, altText, isAvatar, thuTu } = req.body;
            if (!urlAnh) {
                return res.status(400).json({ status: 'error', data: null, message: 'URL ảnh là bắt buộc!' });
            }
            const newImage = await HinhAnhModel.create(
                String(urlAnh).trim(),
                isAvatar === 1 || isAvatar === true || isAvatar === '1',
                altText ? String(altText).trim() || null : null,
                Number(thuTu ?? 0)
            );
            return res.status(201).json({ status: 'success', data: newImage, message: 'Thêm ảnh bằng URL thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ status: 'error', data: null, message: 'Không có file được upload' });
            }

            const { altText, isAvatar, thuTu } = req.body;
            const urlAnh = `/uploads/${req.file.filename}`;

            const newImage = await HinhAnhModel.create(
                urlAnh,
                isAvatar === 1 || isAvatar === true || isAvatar === '1',
                altText ? String(altText).trim() || null : null,
                Number(thuTu ?? 0)
            );

            return res.status(201).json({ status: 'success', data: newImage, message: 'Upload ảnh thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async updateImage(req, res) {
        try {
            const { urlAnh, altText, isAvatar, thuTu } = req.body;
            const maHinhAnh = Number(req.params.id);
            if (!urlAnh) {
                return res.status(400).json({ status: 'error', data: null, message: 'URL ảnh là bắt buộc!' });
            }
            const data = await HinhAnhModel.update(maHinhAnh, {
                urlAnh: String(urlAnh).trim(),
                altText: altText ? String(altText).trim() || null : null,
                isAvatar,
                thuTu: Number(thuTu)
            });
            if (!data) {
                return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy ảnh' });
            }
            return res.status(200).json({ status: 'success', data, message: 'Cập nhật ảnh thành công!' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async deleteImage(req, res) {
        try {
            const maHinhAnh = Number(req.params.id);
            const deleted = await HinhAnhModel.remove(maHinhAnh);
            if (!deleted) return res.status(404).json({ status: 'error', data: null, message: 'Không tìm thấy ảnh' });
            return res.status(200).json({ status: 'success', data: null, message: 'Đã xóa ảnh' });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }

    static async bulkDeleteImages(req, res) {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ status: 'error', data: null, message: 'Yêu cầu mảng ids không rỗng' });
            }
            const count = await HinhAnhModel.removeMany(ids.map(Number));
            return res.status(200).json({ status: 'success', data: { deleted: count }, message: `Đã xóa ${count} ảnh` });
        } catch (error) {
            return res.status(500).json({ status: 'error', data: null, message: error.message });
        }
    }
}

module.exports = HinhAnhAdminController;
