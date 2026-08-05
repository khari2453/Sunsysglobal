variable "region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name to use (optional)"
  type        = string
  default     = "default"
}

variable "name" {
  description = "Common name prefix for resources"
  type        = string
  default     = "sunsystech"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_count" {
  description = "Number of public subnets to create (spread across AZs)"
  type        = number
  default     = 2
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "sunsystech-eks"
}

variable "node_group_name" {
  description = "EKS managed node group name"
  type        = string
  default     = "sunsystech-nodes"
}

variable "node_instance_type" {
  description = "EC2 instance type for worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 3
}

