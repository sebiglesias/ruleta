// Request notification permission
async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Register service worker for push notifications
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered for push notifications');
          
          // You can subscribe to push notifications here if using a push service
          // await subscribeToPush(registration);
          
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
      
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Function to trigger a test notification
function triggerTestNotification(title = 'Test Notification', body = 'This is a test notification') {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: title,
      body: body
    });
  } else {
    // Fallback to regular notifications if service worker isn't ready
    new Notification(title, {
      body: body,
      icon: '/icons/icon-192.png'
    });
  }
}

// Listen for service worker messages to show notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
      triggerTestNotification(event.data.title, event.data.body);
    }
  });
}

// Initialize notifications when the app loads
document.addEventListener('DOMContentLoaded', function() {
  // Add a button to request notification permissions
  const notificationButton = document.createElement('button');
  notificationButton.textContent = 'Activar Notificaciones';
  notificationButton.style.position = 'fixed';
  notificationButton.style.top = '10px';
  notificationButton.style.right = '10px';
  notificationButton.style.zIndex = '1000';
  notificationButton.style.padding = '10px';
  notificationButton.style.backgroundColor = '#007bff';
  notificationButton.style.color = 'white';
  notificationButton.style.border = 'none';
  notificationButton.style.borderRadius = '5px';
  notificationButton.style.cursor = 'pointer';
  
  notificationButton.addEventListener('click', async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      notificationButton.textContent = 'Notificaciones Activadas';
      notificationButton.style.backgroundColor = '#28a745';
      
      // Test notification
      setTimeout(() => {
        triggerTestNotification(
          '¡Ruleta Lista!', 
          'Ahora recibirás notificaciones incluso con la app cerrada'
        );
      }, 1000);
    }
  });
  
  document.body.appendChild(notificationButton);
});
