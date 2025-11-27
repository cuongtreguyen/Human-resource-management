#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script đơn giản để test webcam
Chạy: python test_webcam.py
"""

import cv2
import sys
import time
import os

# Suppress tất cả OpenCV warnings và errors không cần thiết
os.environ['OPENCV_LOG_LEVEL'] = 'SILENT'
cv2.setLogLevel(0)  # 0 = SILENT, 1 = ERROR, 2 = WARN, 3 = INFO, 4 = DEBUG

def find_available_camera(max_index=3):
    """
    Tìm camera có sẵn bằng cách thử từng index với nhiều backend
    Trả về None nếu không tìm thấy camera nào
    """
    print("=" * 60)
    print("[SCAN] Đang quét camera...")
    print("-" * 60)
    
    available_cameras = []
    
    # Danh sách backend để thử (ưu tiên MSMF trên Windows 10+)
    backends_to_try = [
        (cv2.CAP_MSMF, "Media Foundation (MSMF)"),  # Windows 10+ recommended
        (cv2.CAP_ANY, "Default/Any"),                # Fallback
        (cv2.CAP_DSHOW, "DirectShow"),                # Windows legacy
    ]
    
    # Thử từng index
    for i in range(max_index):
        print(f"[SCAN] Thử index {i}...", end=" ")
        found = False
        
        for backend, name in backends_to_try:
            try:
                cap = cv2.VideoCapture(i, backend)
                if cap.isOpened():
                    # Đợi một chút để camera khởi tạo
                    time.sleep(0.3)
                    # Thử đọc một frame để chắc chắn camera hoạt động
                    ret, frame = cap.read()
                    if ret and frame is not None and frame.size > 0:
                        available_cameras.append((i, backend, name))
                        print(f"✓ Tìm thấy camera (backend: {name})")
                        cap.release()
                        found = True
                        break  # Đã tìm thấy, không cần thử backend khác
                    cap.release()
            except Exception:
                pass
        
        if not found:
            print("✗ Không có camera")
    
    print("-" * 60)
    
    if available_cameras:
        result = available_cameras[0]
        print(f"[SUCCESS] Tìm thấy {len(available_cameras)} camera(s)")
        print(f"[INFO] Sử dụng camera index {result[0]} với backend: {result[2]}")
        return result
    else:
        print("[ERROR] KHÔNG TÌM THẤY CAMERA NÀO!")
        print("\n[NGUYÊN NHÂN CÓ THỂ:]")
        print("  1. Laptop/PC không có camera tích hợp")
        print("  2. Camera USB chưa được kết nối")
        print("  3. Camera đang bị ứng dụng khác sử dụng (Zoom, Teams, Skype, etc.)")
        print("  4. Driver camera chưa được cài đặt")
        print("\n[GIẢI PHÁP:]")
        print("  - Gắn webcam USB vào laptop")
        print("  - Đóng tất cả ứng dụng đang sử dụng camera")
        print("  - Kiểm tra Device Manager > Cameras")
        print("=" * 60)
        return None

def test_webcam(camera_index=None, backend=None):
    """
    Mở webcam và hiển thị video stream
    Press 'q' để thoát
    """
    if camera_index is None:
        result = find_available_camera()
        if result is None:
            return False
        camera_index, backend, backend_name = result
    else:
        # Nếu chỉ có index, thử các backend
        if backend is None:
            backends_to_try = [
                (cv2.CAP_MSMF, "Media Foundation (MSMF)"),
                (cv2.CAP_ANY, "Default/Any"),
                (cv2.CAP_DSHOW, "DirectShow"),
            ]
        else:
            backends_to_try = [(backend, "Specified")]
    
    print("\n[INIT] Đang khởi tạo camera...")
    
    # Thử mở webcam
    cap = None
    backend_used = None
    
    if backend is not None:
        # Dùng backend đã chỉ định
        backends_to_try = [(backend, "Specified")]
    else:
        # Thử nhiều backend
        backends_to_try = [
            (cv2.CAP_MSMF, "Media Foundation (MSMF)"),
            (cv2.CAP_ANY, "Default/Any"),
            (cv2.CAP_DSHOW, "DirectShow"),
        ]
    
    for be, name in backends_to_try:
        try:
            cap = cv2.VideoCapture(camera_index, be)
            
            if cap.isOpened():
                # Set resolution
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                
                # Đợi webcam khởi tạo (quan trọng!)
                time.sleep(0.5)
                
                # Test đọc frame
                ret, test_frame = cap.read()
                if ret and test_frame is not None and test_frame.size > 0:
                    print(f"[SUCCESS] Camera đã sẵn sàng!")
                    backend_used = name
                    break
                else:
                    cap.release()
                    cap = None
            else:
                if cap:
                    cap.release()
                cap = None
        except Exception:
            if cap:
                cap.release()
            cap = None
    
    if cap is None or not cap.isOpened():
        print(f"\n[ERROR] Không thể mở camera tại index {camera_index}")
        print("[INFO] Camera có thể đang bị ứng dụng khác sử dụng")
        return False

    print("[INFO] Camera đã sẵn sàng!")
    print("[INFO] Nhấn 'q' để thoát\n")
    
    frame_count = 0
    error_count = 0
    max_errors = 10

    try:
        while True:
            ret, frame = cap.read()
            
            if not ret or frame is None or frame.size == 0:
                error_count += 1
                if error_count >= max_errors:
                    print(f"\n[ERROR] Không thể đọc frame từ camera sau {max_errors} lần thử")
                    print("[INFO] Camera có thể đã bị ngắt kết nối hoặc bị ứng dụng khác sử dụng")
                    break
                time.sleep(0.1)
                continue
            
            # Reset error count nếu đọc thành công
            error_count = 0
            frame_count += 1
            
            # Hiển thị thông tin trên frame
            cv2.putText(frame, f"Frame: {frame_count}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, "Press 'q' to quit", (10, frame.shape[0] - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            cv2.imshow('Webcam Test - Press Q to quit', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("[INFO] Đã thoát")
                break

    except KeyboardInterrupt:
        print("\n[INFO] Đã dừng (Ctrl+C)")
    except Exception as e:
        print(f"\n[ERROR] Lỗi khi đọc frame: {e}")
    finally:
        if cap:
            cap.release()
        cv2.destroyAllWindows()
        print(f"\n[INFO] Camera đã đóng")
        print(f"[INFO] Tổng số frame đã đọc: {frame_count}")
        print("=" * 60)

    return True

if __name__ == "__main__":
    camera_index = None
    backend = None
    
    if len(sys.argv) > 1:
        try:
            camera_index = int(sys.argv[1])
        except ValueError:
            print(f"[WARNING] Index không hợp lệ: {sys.argv[1]}, sẽ tự động tìm camera")
            camera_index = None
    
    # Chạy test webcam
    test_webcam(camera_index, backend)
