class Listing < ActiveRecord::Base

  def self.random
    find(:first, :offset => (count * rand).to_i)
  end

end
