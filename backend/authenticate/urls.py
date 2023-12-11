from django.urls import path
from .views import SignupView, OtpValidateView

urlpatterns = [
    # path('login/', FilterView.as_view()),
    path('signup/', SignupView.as_view()),
    path('validate_otp/', OtpValidateView.as_view())
]