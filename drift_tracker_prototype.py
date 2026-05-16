import time
import win32gui
import win32process
import psutil
from datetime import datetime

# CONFIGURATION
# Add apps that you consider "Deep Work" apps
DEEP_WORK_APPS = ['code.exe', 'pycharm64.exe', 'windowsterminal.exe', 'cursor.exe']

def get_active_window_info():
    """Returns the title and process name of the current active window."""
    try:
        window = win32gui.GetForegroundWindow()
        title = win32gui.GetWindowText(window)
        
        _, pid = win32process.GetWindowThreadProcessId(window)
        process = psutil.Process(pid)
        process_name = process.name()
        
        return title, process_name
    except Exception:
        return "Unknown", "Unknown"

def main():
    print("🚀 Task Anchor: Drift Tracker Prototype [INITIALIZED]")
    print(f"Monitoring your focus on: {', '.join(DEEP_WORK_APPS)}")
    print("-" * 50)
    
    last_process = None
    start_time = time.time()
    
    try:
        while True:
            title, process = get_active_window_info()
            
            if process != last_process:
                timestamp = datetime.now().strftime("%H:%M:%S")
                duration = round(time.time() - start_time, 2)
                
                if last_process:
                    print(f"[{timestamp}] Spent {duration}s on: {last_process}")
                
                status = "✅ FOCUS" if process.lower() in DEEP_WORK_APPS else "⚠️ DRIFT"
                print(f"[{timestamp}] {status} | Switched to: {process} ({title})")
                
                last_process = process
                start_time = time.time()
            
            time.sleep(1) # Check every second
            
    except KeyboardInterrupt:
        print("\n🛑 Tracker Stopped. Data saved to session memory.")

if __name__ == "__main__":
    main()
