from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .serializers import UserSerializer
from .models import User
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .utils import send_account_activation, send_password_reset
from django.contrib.auth.tokens import default_token_generator

class SignupAPIView(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            user = authenticate(username=request.data['username'], password = request.data['password'])
            if user:
                refresh_token = RefreshToken.for_user(user)
                access_token = AccessToken.for_user(user)
                content={
                    'refresh': str(refresh_token),
                    'access': str(access_token)
                }
                return Response(content, status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            return Response({'message': 'something went wrong'}, status.HTTP_400_BAD_REQUEST)

class AccountActivateView(APIView):
    # permission_classes = (IsAuthenticated, )

    # def get(self, request, *args, **kwargs):
    #     username = kwargs.get('username')
    #     # email_verification_token = 

    def post(self, request):
        user = None
        try:
            user = User.objects.get(username = request.data.get('username'))
        except:
            if request.user.is_authenticated:
                user = request.user
        if not user:
            return Response({'error': 'user doesn\'t exist'}, status.HTTP_400_BAD_REQUEST)
        if (user.otp == request.data.get('OTP') or user.email_verification_token == request.data.get('token')):
            user.is_email_verified = True
            user.otp = None
            user.email_verification_token = None
            user.save()
            return Response(status.HTTP_200_OK)
        return Response({'error': 'wrong OTP'}, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request):
        user = request.user
        if send_account_activation(user):
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error': 'try after some time'}, status.HTTP_400_BAD_REQUEST)
        

class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated, )
    def post(self, request, *args, **kwargs):
        if ('currentPassword' in request.data and 'newPassword' in request.data):
            user = authenticate(username=request.user.username, password=request.data['currentPassword'])
            if not user:
                return Response({"Current Password": "wrong password"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(request.data['newPassword'])
            user.save()
            return Response(status=status.HTTP_200_OK)
           
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token')
        username = request.GET.get('username')
        if token and username:
            try:
                user = User.objects.get(username = username)
            except:
                return Response({'error': 'user doesn\'t exist'}, status.HTTP_400_BAD_REQUEST)
            if default_token_generator.check_token(user, token):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response({'error': 'token expired'}, status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        token = request.data.get('token')
        password = request.data.get('password')
        try:
            user = User.objects.get(username = request.data.get('username'))
        except:
            return Response({'error': 'user doesn\'t exist'}, status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            return Response({'error': 'token expired'}, status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'error': 'empty password'}, status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.save()
        return Response(status.HTTP_200_OK)

    def patch(self, request):
        try:
            user = User.objects.get(email = request.data.get('email'))
        except:
            return Response({'error': 'user doesn\'t exist'}, status.HTTP_400_BAD_REQUEST)

        if send_password_reset(user):
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error': 'try after some time'}, status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)