from django.urls import path
from .views import MovieList, DashboardList, FilterList

urlpatterns = [
    path('', DashboardList.as_view()),
    path('search/', MovieList.as_view()),
    path('filters/', FilterList.as_view()),
]