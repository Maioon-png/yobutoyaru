class Peer < ApplicationRecord
  belongs_to :user
  validates :peer, presence: true
end
