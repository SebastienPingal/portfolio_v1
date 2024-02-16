provider "aws" {
  region = "us-east-1" # Change to your preferred AWS region
}

resource "aws_s3_bucket" "portfolio_v1" {
  bucket = "portfolio-v1"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = "s3:GetObject",
        Resource = "arn:aws:s3:::portfolio-v1/*"
        principal = "*"
      }
    ]
  })
}
